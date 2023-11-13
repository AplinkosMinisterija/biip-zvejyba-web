import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import SwitchButton from '../components/buttons/SwitchButton';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  device,
  FishingWeighType,
  handleAlert,
  slugs,
  useAppSelector,
  useFishTypes,
  useGetCurrentRoute,
} from '../utils';
import api from '../utils/api';
import DefaultLayout from '../components/layouts/DefaultLayout';
import FishRow from '../components/other/FishRow';
import Button from '../components/buttons/Button';

const FishingWeightOptions = [
  { label: 'Sugautos žuvys', value: FishingWeighType.CAUGHT },
  { label: 'Visos žuvys', value: FishingWeighType.All },
];

const FishingWeight = () => {
  const queryClient = useQueryClient();
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const currentRoute = useGetCurrentRoute();
  const { fishingId } = useParams();
  const { fishTypes, isLoading } = useFishTypes();
  const isCaught = type === FishingWeighType.CAUGHT;
  const navigate = useNavigate();
  const coordinates = useAppSelector((state) => state.fishing.coordinates);
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});

  const {
    data: fishingWeights = { preliminary: {}, total: {} },
    isLoading: fishingWeightsLoading,
  } = useQuery(['fishingWeights'], api.getFishingWeights, { retry: false });

  const initialValues = fishTypes
    .filter((fishType) => (isCaught ? !!fishingWeights.preliminary[fishType.id] : true))
    .map((fishType) => ({
      ...fishType,
      preliminaryAmount: fishingWeights.preliminary[fishType.id],
      amount: fishingWeights.preliminary[fishType.id] || '',
    }));

  const { mutateAsync: fishingWeightMutation, isLoading: fishingWeightLoading } = useMutation(
    (data: any) => api.createFishingFishWeights(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['fishingWeights']);
        navigate(slugs.fishing(fishingId!));
      },
      onError: () => {
        handleAlert();
      },
    },
  );

  const handleSubmit = () => {
    fishingWeightMutation({ data: amounts, coordinates });
  };

  if (isLoading || fishingWeightsLoading) return <LoaderComponent />;

  const updateAmounts = (value: { [key: number]: number }) => {
    setAmounts({ ...amounts, ...value });
  };

  return (
    <DefaultLayout title={currentRoute?.title} back={currentRoute?.back}>
      <SwitchButton options={FishingWeightOptions} value={type} onChange={setType} />
      {initialValues?.map((fishType: any) => (
        <FishRow
          key={`fish_type_${fishType.id}`}
          fish={{ ...fishType, amount: amounts[fishType.id] || 0 }}
          onChange={(value) => {
            updateAmounts({ [fishType.id]: value || undefined });
          }}
        />
      ))}
      <Footer>
        <StyledButton
          loading={fishingWeightLoading}
          disabled={fishingWeightLoading}
          onClick={handleSubmit}
        >
          Saugoti pakeitimus
        </StyledButton>
      </Footer>
    </DefaultLayout>
  );
};

export default FishingWeight;

const Footer = styled.div`
  display: block;
  position: sticky;
  bottom: 0;
  cursor: pointer;
  padding: 16px 0;
  text-decoration: none;
  width: 100%;
  background-color: white;
  @media ${device.desktop} {
    padding: 16px 0 0 0;
  }
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
