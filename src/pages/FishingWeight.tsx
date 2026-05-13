import { Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { Footer } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import LoaderComponent from '../components/other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../components/providers/PopupProvider';
import {
  FishingWeighType,
  handleErrorToast,
  PopupContentType,
  useCurrentFishing,
  useFishingWeightMutation,
  useFishTypes,
  useFishWeights,
  useGeolocation,
  validationTexts,
} from '../utils';

const FishingWeight = () => {
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const [isSwitching, setIsSwitching] = useState(false);
  const { isLoading: currentFishingLoading } = useCurrentFishing();
  const { fishTypes, fishTypesLoading } = useFishTypes();
  const { fishingWeights, fishingWeightsLoading } = useFishWeights();
  const { fishingWeightLoading, fishingWeightMutation } = useFishingWeightMutation();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const { coordinates, loading, refresh: refreshGeolocation } = useGeolocation();

  if (currentFishingLoading || fishTypesLoading || fishingWeightsLoading) {
    return <LoaderComponent />;
  }

  // Always include every fish the fisher registered on the boat: if the
  // user previously submitted onshore weights without one of them, the
  // entry would otherwise vanish from the form forever (preliminary keys
  // missing from `total` would never re-render). Total values take
  // precedence so already-edited rows keep the onshore amount.
  const preliminaryData = fishingWeights?.preliminary ?? {};
  const totalData = fishingWeights?.total ?? {};
  const caughtFishData: { [key: string]: number } = { ...preliminaryData, ...totalData };
  const initialValues = (
    type !== FishingWeighType.CAUGHT
      ? fishTypes.map((fishType) => {
          const amount = caughtFishData[fishType.id];
          const preliminary = preliminaryData[fishType.id];
          return {
            ...fishType,
            preliminaryAmount: preliminary ?? '',
            amount: amount ?? '',
          };
        })
      : Object.keys(caughtFishData)?.map((key: string) => {
          const fishType = fishTypes.find((fishType) => fishType.id === Number(key));
          return {
            ...fishType,
            preliminaryAmount: preliminaryData[key] ?? '',
            amount: caughtFishData[key] ?? '',
          };
        })
  ).sort((a, b) => (Number(b.preliminaryAmount) || 0) - (Number(a.preliminaryAmount) || 0));

  const mapWeights = (values: any) => {
    return values.reduce((obj: any, curr: any) => {
      if (curr.amount !== '' && curr.amount != null) {
        obj[curr.id] = Number(curr.amount);
      }

      return obj;
    }, {});
  };

  const handleSubmit = (values: any) => {
    if (!coordinates) {
      refreshGeolocation();
      return handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }

    const mappedWeights = mapWeights(values);

    fishingWeightMutation({
      data: mappedWeights,
      preliminaryData: fishingWeights?.preliminary,
      coordinates: coordinates,
      isAutoSave: false,
    });
  };

  const fishingWeightLoadingOrSwitching = fishingWeightLoading || isSwitching || loading;

  return (
    <DefaultLayout>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(data) => {
          const hasAtLeastOneFilled = data.some(
            (item: any) => item.amount !== undefined && item.amount !== null && item.amount !== '',
          );

          if (!hasAtLeastOneFilled) {
            handleErrorToast('Bent viena žuvis turi būti įvesta');
            return;
          }

          // Onshore weighing requires a value (0 is fine) for every fish
          // the fisher registered on the boat — otherwise the boat-side
          // preliminary entry would have no counterpart in the final
          // report. Only enforce on rows that carry a server-provided
          // `preliminaryAmount`.
          const missing = data.filter(
            (item: any) =>
              item.preliminaryAmount !== undefined &&
              item.preliminaryAmount !== null &&
              item.preliminaryAmount !== '' &&
              (item.amount === undefined || item.amount === null || item.amount === ''),
          );
          if (missing.length > 0) {
            const labels = missing.map((m: any) => m.label).join(', ');
            handleErrorToast(
              `Užpildykite šių žuvų iškrovimą: ${labels}. Jei paleidote atgal, įveskite 0 kg.`,
            );
            return;
          }

          showPopup({
            type: PopupContentType.CONFIRM_WEIGHT,
            content: {
              submit: () => handleSubmit(data),
            },
          });
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <>
              <StyledForm $disabled={fishingWeightLoadingOrSwitching}>
                {values?.map((item: any, index: number) => (
                  <FishRow
                    key={`fish_type_${item.id}`}
                    fish={item}
                    onChange={(value) => {
                      setFieldValue(`${index}.amount`, value);
                    }}
                  />
                ))}
                <Footer>
                  <StyledButton
                    type="submit"
                    loading={fishingWeightLoadingOrSwitching}
                    disabled={fishingWeightLoadingOrSwitching}
                  >
                    Saugoti pakeitimus
                  </StyledButton>
                </Footer>
              </StyledForm>
            </>
          );
        }}
      </Formik>
    </DefaultLayout>
  );
};

const StyledForm = styled(Form)<{ $disabled?: boolean }>`
  width: 100%;
  height: fit-content;
  ${({ $disabled }) => $disabled && `opacity: 0.7; pointer-events: none;`}
`;

const StyledButton = styled(Button)<{ $disabled?: boolean }>`
  width: 100%;
  border-radius: 28px;
  height: 56px;
  display: block;
  line-height: 56px;
  font-size: 20px;
  font-weight: 600;
  padding: 0;
  ${({ $disabled }) => $disabled && `opacity: 0.7; pointer-events: none;`}
`;

export default FishingWeight;
