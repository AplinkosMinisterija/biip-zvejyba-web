import { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FishingWeighType,
  handleErrorToastFromServer,
  handleSuccessToast,
  slugs,
  useFishTypes,
} from '../utils';
import api from '../utils/api';
import Button from '../components/buttons/Button';
import SwitchButton from '../components/buttons/SwitchButton';
import { Footer } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import LoaderComponent from '../components/other/LoaderComponent';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { Form, Formik } from 'formik';

const FishingWeightOptions = [
  { label: 'Sugautos žuvys', value: FishingWeighType.CAUGHT },
  { label: 'Visos žuvys', value: FishingWeighType.All },
];

const FishingWeight = () => {
  const queryClient = useQueryClient();
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const { fishTypes, isLoading } = useFishTypes();
  const isCaught = type === FishingWeighType.CAUGHT;
  const navigate = useNavigate();
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

  const {
    data: fishingWeights = { preliminary: {}, total: {} },
    isLoading: fishingWeightsLoading,
  } = useQuery(['fishingWeights'], api.getFishingWeights, { retry: false });

  const hasFishOnBoat = !!Object.values(fishingWeights.preliminary || {}).length;

  const initialValues = Object.keys(fishingWeights?.preliminary || [])?.map((key: string) => {
    const fishType = fishTypes.find((fishType) => fishType.id === Number(key));
    return {
      ...fishType,
      preliminaryAmount: fishingWeights.preliminary[key],
      amount: fishingWeights.preliminary[key] || '',
    };
  });

  const { mutateAsync: fishingWeightMutation, isLoading: fishingWeightLoading } = useMutation(
    (data: any) => api.createFishingFishWeights(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['fishingWeights']);
        handleSuccessToast('Žuvis sėkmingai pasverta krante.');
        navigate(slugs.fishingCurrent);
      },
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const handleSubmit = (values: any) => {
    if (!window.coordinates) return;
    const mappedWeights = values.reduce((obj: any, curr: any) => {
      obj[curr.id] = Number(curr.amount) || undefined;
      return obj;
    }, {});

    fishingWeightMutation({
      data: mappedWeights,
      coordinates: window.coordinates,
    });
  };

  if (isLoading || fishingWeightsLoading) return <LoaderComponent />;

  return (
    <DefaultLayout>
      {hasFishOnBoat && (
        <SwitchButton options={FishingWeightOptions} value={type} onChange={setType} />
      )}
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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

export default FishingWeight;

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

const StyledForm = styled(Form)`
  width: 100%;
  height: fit-content;
`;
