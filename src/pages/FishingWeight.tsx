import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import SwitchButton from '../components/buttons/SwitchButton';
import FishForm from '../components/forms/FishForm';
import FormLayout from '../components/layouts/FormLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import { FishingWeighType, handleAlert, slugs, useFishTypes, useGetCurrentRoute } from '../utils';
import api from '../utils/api';

const FishingWeightOptions = [
  { label: 'Sugautos žuvys', value: FishingWeighType.CAUGHT },
  { label: 'Visos žuvys', value: FishingWeighType.All },
];

const FishingWeight = () => {
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const currentRoute = useGetCurrentRoute();
  const { fishingId } = useParams();
  const { fishTypes, isLoading } = useFishTypes();
  const isCaught = type === FishingWeighType.CAUGHT;
  const navigate = useNavigate();

  const { data = [], isLoading: preliminaryFishWeightLoading } = useQuery(
    ['preliminaryFishWeights'],
    api.preliminaryFishWeights,
  );

  const initialValues = fishTypes
    .filter((fishType) => (isCaught ? !!data[fishType.id] : true))
    .map((fishType) => ({
      ...fishType,
      preliminaryAmount: data[fishType.id],
      amount: data[fishType.id] || '',
    }));

  const { mutateAsync: fishingFishWeightsMutation, isLoading: fishingFishWeightsLoading } =
    useMutation((data: any) => api.createFishingFishWeights(data), {
      onSuccess: () => {
        navigate(slugs.fishing(fishingId!));
      },
      onError: () => {
        handleAlert();
      },
    });

  const handleSubmit = (values: typeof initialValues) => {
    const data = values.reduce((obj: any, curr) => {
      if (Number(curr.amount)) {
        obj[curr.id] = curr.amount;
      }

      return obj;
    }, {});

    fishingFishWeightsMutation({ data });
  };

  if (isLoading || preliminaryFishWeightLoading) return <LoaderComponent />;

  return (
    <FormLayout title={currentRoute?.title} back={currentRoute?.back}>
      <SwitchButton options={FishingWeightOptions} value={type} onChange={setType} />
      <FishForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        loading={fishingFishWeightsLoading}
      />
    </FormLayout>
  );
};

export default FishingWeight;
