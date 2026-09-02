import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
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
  useFishTypes,
  useGeolocation,
  useGetCurrentRoute,
} from '../../utils';
import api from '../../utils/api';
import Button from '../buttons/Button';
import SwitchButton from '../buttons/SwitchButton';
import Popup from '../layouts/Popup';
import { Footer } from '../other/CommonStyles';
import FishRow from '../other/FishRow';
import LoaderComponent from '../other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const weighModeOptions = [
  { label: 'Šio įrankio svoris', value: false },
  { label: 'Bendras svoris laive', value: true },
];

const CaughtFishWeight = ({ content: { location, toolsGroup }, onClose }: any) => {
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, fishTypesLoading } = useFishTypes();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const { coordinates, loading, refresh: refreshGeolocation } = useGeolocation();
  const [cumulative, setCumulative] = useState(false);

  const {
    data: fishingWeights,
    isLoading: fishingWeightsLoading,
    isFetching: fishingWeightsFetching,
  } = useQuery(['fishingWeights', toolsGroup?.id], () => api.getFishingWeights(toolsGroup?.id), {
    retry: false,
    enabled: !!toolsGroup?.id,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Fishing-wide aggregate — needed to know what OTHER tools groups already
  // recorded, so the scale's cumulative reading can be split automatically.
  const {
    data: allFishingWeights,
    isLoading: allWeightsLoading,
    isFetching: allWeightsFetching,
  } = useQuery(['fishingWeights'], () => api.getFishingWeights(), {
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });

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
        queryClient.invalidateQueries(['fishingWeights', toolsGroup.id]);
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
  const cumulativeMode = cumulative && hasOtherWeights;

  const initialValues = useMemo(() => {
    const list = [...(fishTypes ?? [])].sort((a, b) => b.priority - a.priority);

    return list.map((fishType) => {
      const preliminaryAmount = fishingWeights?.preliminary?.[fishType.id];

      // In cumulative mode the input holds the scale reading, so an already
      // weighed species is prefilled as "others + own" — leaving it untouched
      // resubmits the same own catch, mirroring the plain mode's prefill.
      const amount = cumulativeMode
        ? preliminaryAmount != null
          ? preliminaryAmount + (otherWeights[fishType.id] ?? 0)
          : ''
        : preliminaryAmount ?? '';

      return {
        ...fishType,
        amount,
      };
    });
  }, [fishTypes, fishingWeights?.preliminary, cumulativeMode, otherWeights]);

  if (
    fishTypesLoading ||
    fishingWeightsLoading ||
    fishingWeightsFetching ||
    allWeightsLoading ||
    allWeightsFetching
  )
    return <LoaderComponent />;

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
      {hasOtherWeights && (
        <StyledSwitchButton options={weighModeOptions} value={cumulative} onChange={setCumulative} />
      )}
      <Message>{cumulativeMode ? 'Bendras svoris laive, kg' : 'Apytikslis svoris, kg'}</Message>
      {cumulativeMode && (
        <Hint>
          Įveskite svarstyklių rodomą bendrą svorį — šio įrankio laimikį apskaičiuosime atėmę
          kituose įrankiuose jau užfiksuotą kiekį.
        </Hint>
      )}
      <Formik
        key={`${toolsGroup?.id}_${cumulativeMode}`}
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

          const weights = cumulativeMode ? cumulativeToDeltas(entered, otherWeights) : entered;

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
                  cumulativeMode && value.amount !== '' && value.amount != null
                    ? cumulativeToDeltas({ [value.id]: Number(value.amount) }, otherWeights)[
                        value.id
                      ]
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

const StyledSwitchButton = styled(SwitchButton)`
  padding: 16px 0 0;
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
