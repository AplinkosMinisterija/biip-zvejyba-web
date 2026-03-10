import { Form, Formik } from 'formik';
import { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import SwitchButton from '../components/buttons/SwitchButton';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { Footer } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  FishingWeighType,
  handleErrorToast,
  LocationType,
  useCurrentFishing,
  useFishingWeightMutation,
  useFishTypes,
  useFishWeights,
  validationTexts,
} from '../utils';

const FishingWeightOptions = [
  { label: 'Sugautos žuvys', value: FishingWeighType.CAUGHT },
  { label: 'Visos žuvys', value: FishingWeighType.All },
];

const FishingWeight = () => {
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const [isSwitching, setIsSwitching] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const showSwitch = currentFishing?.type !== LocationType.INLAND_WATERS;
  const { fishTypes, fishTypesLoading } = useFishTypes();
  const { fishingWeights, fishingWeightsLoading } = useFishWeights();
  const { fishingWeightLoading, fishingWeightMutation } = useFishingWeightMutation();

  if (currentFishingLoading || fishTypesLoading || fishingWeightsLoading) {
    return <LoaderComponent />;
  }

  const caughtFishData = fishingWeights?.total || fishingWeights?.preliminary || {};
  const initialValues = (
    currentFishing?.type === LocationType.INLAND_WATERS || type !== FishingWeighType.CAUGHT
      ? fishTypes.map((fishType) => {
          const amount = (fishingWeights?.total || fishingWeights?.preliminary)?.[fishType.id];
          return {
            ...fishType,
            preliminaryAmount: amount || '',
            amount: amount || '',
          };
        })
      : Object.keys(caughtFishData)?.map((key: string) => {
          const fishType = fishTypes.find((fishType) => fishType.id === Number(key));
          return {
            ...fishType,
            preliminaryAmount: caughtFishData[key] || '',
            amount: caughtFishData[key] || '',
          };
        })
  ).sort((a, b) => (Number(b.preliminaryAmount) || 0) - (Number(a.preliminaryAmount) || 0));

  const mapWeights = (values: any) => {
    return values.reduce((obj: any, curr: any) => {
      if (curr.amount) obj[curr.id] = Number(curr.amount) || undefined;
      return obj;
    }, {});
  };

  const handleSubmit = (values: any) => {
    if (!window?.coordinates) return handleErrorToast(validationTexts.mustAllowToSetCoordinates);

    const mappedWeights = mapWeights(values);

    fishingWeightMutation({
      data: mappedWeights,
      coordinates: window.coordinates,
      isAutoSave: false,
    });
  };

  const handleSwitchChange = (newValue: FishingWeighType, values: any, setFieldValue: any) => {
    setIsSwitching(true);
    setType(newValue);
    if (!window.coordinates) {
      setIsSwitching(false);
      return;
    }
    try {
      const mappedWeights = mapWeights(values);

      fishingWeightMutation({
        data: mappedWeights,
        coordinates: window.coordinates,
        isAutoSave: true,
      });

      const updatedValues =
        newValue === FishingWeighType.CAUGHT
          ? fishTypes.map((fishType) => {
              const amount = (fishingWeights?.total || fishingWeights?.preliminary)?.[fishType.id];
              return {
                ...fishType,
                preliminaryAmount: amount || '',
                amount: amount || '',
              };
            })
          : Object.keys(caughtFishData)?.map((key: string) => {
              const fishType = fishTypes.find((fishType) => fishType.id === Number(key));
              return {
                ...fishType,
                preliminaryAmount: caughtFishData[key] || '',
                amount: caughtFishData[key] || '',
              };
            });

      updatedValues.forEach((item: any, index: number) => {
        setFieldValue(`${index}.amount`, item.amount);
      });
    } catch (error) {
      console.error('Klaida keičiant tipą:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const fishingWeightLoadingOrSwitching = fishingWeightLoading || isSwitching;

  return (
    <DefaultLayout>
      <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <>
              {showSwitch && (
                <SwitchButton
                  options={FishingWeightOptions}
                  value={type}
                  onChange={(newValue) => handleSwitchChange(newValue, values, setFieldValue)}
                  loading={fishingWeightLoadingOrSwitching}
                />
              )}
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
