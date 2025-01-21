import { useContext, useState } from 'react';
import {
  FishingWeighType,
  LocationType,
  PopupContentType,
  useCurrentFishing,
  useFishingWeightMutation,
  useFishTypes,
  useFishWeights,
} from '../utils';
import SwitchButton from '../components/buttons/SwitchButton';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { Form, Formik } from 'formik';
import FishRow from '../components/other/FishRow';
import { Footer } from '../components/other/CommonStyles';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import LoaderComponent from '../components/other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../components/providers/PopupProvider';
import { IconName } from '../components/other/Icon';

const FishingWeightOptions = [
  { label: 'Sugautos žuvys', value: FishingWeighType.CAUGHT },
  { label: 'Visos žuvys', value: FishingWeighType.All },
];

const FishingWeight = () => {
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const showSwitch = currentFishing?.type !== LocationType.INLAND_WATERS;
  const { fishTypes, fishTypesLoading } = useFishTypes();
  const { fishingWeights, fishingWeightsLoading } = useFishWeights();
  const { fishingWeightLoading, fishingWeightMutation } = useFishingWeightMutation();

  if (currentFishingLoading || fishTypesLoading || fishingWeightsLoading) {
    return <LoaderComponent />;
  }

  const caughtFishData = fishingWeights?.total || fishingWeights?.preliminary || {};
  const initialValues =
    type === FishingWeighType.CAUGHT
      ? Object.keys(caughtFishData)?.map((key: string) => {
          const fishType = fishTypes.find((fishType) => fishType.id === Number(key));
          return {
            ...fishType,
            preliminaryAmount: caughtFishData[key] || '',
            amount: caughtFishData[key] || '',
          };
        })
      : fishTypes.map((fishType) => {
          const amount = fishingWeights?.preliminary?.[fishType.id];
          return {
            ...fishType,
            preliminaryAmount: amount || '',
            amount: amount || '',
          };
        });

  const handleSave = (values: any) => {
    if (!window.coordinates) return;
    const mappedWeights = values.reduce((obj: any, curr: any) => {
      if (curr.amount) obj[curr.id] = Number(curr.amount) || undefined;
      return obj;
    }, {});

    fishingWeightMutation({
      data: mappedWeights,
      coordinates: window.coordinates,
    });
  };
  const handleSubmit = (values: any) => {
    showPopup({
      type: PopupContentType.CONFIRM,
      content: {
        title: 'Ar tikrai norite patvirtinti žuvies svorį?',
        subtitle: 'Atkreipkime dėmesį, kad patvirtinus svorį, jo pakeisti nebebus galima.',
        onConfirm: () => handleSave(values),
        icon: IconName.fish,
        showCancel: true,
      },
    });
  };
  return (
    <DefaultLayout>
      {showSwitch && (
        <SwitchButton options={FishingWeightOptions} value={type} onChange={setType} />
      )}
      <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <StyledForm>
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
                <StyledButton loading={fishingWeightLoading} disabled={fishingWeightLoading}>
                  Saugoti pakeitimus
                </StyledButton>
              </Footer>
            </StyledForm>
          );
        }}
      </Formik>
    </DefaultLayout>
  );
};

const StyledForm = styled(Form)`
  width: 100%;
  height: fit-content;
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

export default FishingWeight;
