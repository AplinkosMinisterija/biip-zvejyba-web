import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  cumulativeToDeltas,
  FishWeightsById,
  getBuiltToolInfo,
  handleErrorToast,
  handleErrorToastFromServer,
  otherToolsPreliminary,
  PopupContentType,
  roundWeight,
  useFishTypes,
  useGeolocation,
  useGetCurrentRoute,
} from '../../utils';
import api from '../../utils/api';
import Button from '../buttons/Button';
import Popup from '../layouts/Popup';
import { Footer } from '../other/CommonStyles';
import FishRow from '../other/FishRow';
import LoaderComponent from '../other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

// The fisher always enters the scale's reading — the boat's cumulative
// weight per species. The app subtracts what OTHER tools groups of this
// fishing already recorded and stores only this group's own catch, so
// nobody needs paper notes between bars.
const CaughtFishWeight = ({ content: { location, toolsGroup }, onClose }: any) => {
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, fishTypesLoading } = useFishTypes();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const { coordinates, loading, refresh: refreshGeolocation } = useGeolocation();

  const { data: fishingWeights, isLoading: fishingWeightsLoading } = useQuery(
    ['fishingWeights', toolsGroup?.id],
    () => api.getFishingWeights(toolsGroup?.id),
    {
      retry: false,
      enabled: !!toolsGroup?.id,
      staleTime: 0,
      refetchOnMount: 'always',
    },
  );

  // Fishing-wide aggregate — what the whole boat's recorded catch weighs.
  const { data: allFishingWeights, isLoading: allWeightsLoading } = useQuery(
    ['fishingWeights'],
    () => api.getFishingWeights(),
    {
      retry: false,
      staleTime: 0,
      refetchOnMount: 'always',
    },
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(['fishingWeights', toolsGroup?.id]);
    };
  }, [queryClient, toolsGroup?.id]);

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => {
      return api.weighTools(data, toolsGroup.id);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['builtTools', location.id]);
        // Prefix-matches the per-group key too.
        queryClient.invalidateQueries(['fishingWeights']);
        onClose();
      },
      onError: ({ response }: any) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  const otherWeights = useMemo(
    () => otherToolsPreliminary(allFishingWeights?.preliminary, fishingWeights?.preliminary),
    [allFishingWeights?.preliminary, fishingWeights?.preliminary],
  );
  const hasOtherWeights = Object.keys(otherWeights).length > 0;

  const initialValues = useMemo(() => {
    const list = [...(fishTypes ?? [])].sort((a, b) => b.priority - a.priority);

    return list.map((fishType) => {
      const preliminaryAmount = fishingWeights?.preliminary?.[fishType.id];

      // The input holds the scale reading, so an already weighed species is
      // prefilled as "others + own" — leaving it untouched resubmits the
      // same own catch.
      const amount =
        preliminaryAmount != null
          ? roundWeight(preliminaryAmount + (otherWeights[fishType.id] ?? 0))
          : '';

      return {
        ...fishType,
        amount,
      };
    });
  }, [fishTypes, fishingWeights?.preliminary, otherWeights]);

  // Gate only on the FIRST load — `isFetching` would unmount the form (and
  // drop the fisher's typed input) on every background refetch, e.g. when the
  // window regains focus or another observer invalidates ['fishingWeights'].
  // Fresh-on-open is still guaranteed: the per-group query is removed from the
  // cache on unmount (above), so reopening always starts with isLoading.
  if (fishTypesLoading || fishingWeightsLoading || allWeightsLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(toolsGroup);

  const handleSubmit = (weights: FishWeightsById) => {
    if (coordinates?.x && coordinates?.y) {
      const params = {
        data: weights,
        coordinates,
        location,
        locationManual: !!location?.manual,
      };
      weighToolsMutation(params);
      return;
    }
    refreshGeolocation();
    handleErrorToast(
      'Nepavyko nustatyti jūsų vietos. Pabandykite dar kartą vėliau ir įsitikinkite, kad naršyklėje suteikti vietos nustatymo leidimai.',
    );
  };

  return (
    <Popup visible={true} onClose={onClose}>
      <Title>{currentRoute?.title}</Title>
      <Heading>{label}</Heading>
      <SealNumbers>Plombos Nr. {sealNr}</SealNumbers>
      <Message>Apytikslis bendras svoris laive, kg</Message>
      {hasOtherWeights && (
        <Hint>
          Įveskite svarstyklių rodomą bendrą svorį — šio įrankio laimikį apskaičiuosime atėmę
          kituose įrankiuose jau užfiksuotą kiekį.
        </Hint>
      )}
      <Formik
        key={toolsGroup?.id}
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(data) => {
          const filledRows = data.filter(
            (item: any) => item.amount !== undefined && item.amount !== null && item.amount !== '',
          );

          if (!filledRows.length) {
            handleErrorToast('Bent viena žuvis turi būti įvesta');
            return;
          }

          const entered = filledRows.reduce((obj: FishWeightsById, curr: any) => {
            obj[curr.id] = Number(curr.amount);
            return obj;
          }, {});

          const weights = cumulativeToDeltas(entered, otherWeights);

          // A new weight event fully replaces the group's previous one, and a
          // cleared cumulative field is ambiguous (skip vs. remove), so a
          // species whose prefilled value was cleared would silently vanish
          // from this group's record. When nothing is recorded elsewhere the
          // reading equals the own catch, so clearing keeps its old meaning.
          const clearedRow = data.find(
            (row: any) =>
              fishingWeights?.preliminary?.[row.id] != null &&
              otherWeights[row.id] > 0 &&
              (row.amount === '' || row.amount == null),
          );
          if (clearedRow) {
            handleErrorToast(
              `${clearedRow.label}: šis įrankis jau turi užfiksuotą laimikį — įveskite bendrą svorį laive`,
            );
            return;
          }

          const negativeRow = filledRows.find((row: any) => weights[row.id] < 0);
          if (negativeRow) {
            handleErrorToast(
              `${negativeRow.label}: bendras svoris negali būti mažesnis nei kituose įrankiuose užfiksuota (${
                otherWeights[negativeRow.id]
              } kg)`,
            );
            return;
          }

          showPopup({
            type: PopupContentType.CONFIRM_WEIGHT,
            content: {
              submit: () => handleSubmit(weights),
            },
          });
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <StyledForm>
              {values?.map((value: any, index: number) => {
                const other = otherWeights[value.id];
                const delta =
                  other > 0 && value.amount !== '' && value.amount != null
                    ? roundWeight(Number(value.amount) - other)
                    : null;

                return (
                  <FishRow
                    key={`fish_type_${value.id}`}
                    fish={value}
                    subLabel={
                      <>
                        {other > 0 && <SubLabel>Kituose įrankiuose: {other} kg</SubLabel>}
                        {delta != null &&
                          (delta < 0 ? (
                            <NegativeDelta>
                              Bendras svoris negali būti mažesnis nei {other} kg
                            </NegativeDelta>
                          ) : (
                            <SubLabel>Šio įrankio laimikis: {delta} kg</SubLabel>
                          ))}
                      </>
                    }
                    onChange={(value) =>
                      setFieldValue(`${index}.amount`, value === '' ? '' : Number(value))
                    }
                    index={index}
                  />
                );
              })}
              <Footer>
                <StyledButton
                  loading={weighToolsIsLoading}
                  disabled={weighToolsIsLoading || loading}
                >
                  Saugoti pakeitimus
                </StyledButton>
              </Footer>
            </StyledForm>
          );
        }}
      </Formik>
    </Popup>
  );
};

const Message = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  margin: 16px 0;
`;

const Hint = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const SubLabel = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NegativeDelta = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.error};
`;

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 28px;
  height: 56px;
  display: block;
  line-height: 56px;
  font-size: 20px;
  font-weight: 600;
  padding: 0;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 16px;
`;

const Heading = styled.div`
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
`;

const SealNumbers = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 26px;
  margin-top: 4px;
  font-size: 1.6rem;
  margin-bottom: 32px;
  text-align: center;
`;

const StyledForm = styled(Form)`
  width: 100%;
  height: fit-content;
`;

export default CaughtFishWeight;
