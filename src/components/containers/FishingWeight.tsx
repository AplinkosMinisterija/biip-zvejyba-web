import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FishingWeighType, handleErrorToastFromServer, useFishTypes } from '../../utils';
import api from '../../utils/api';
import Button from '../buttons/Button';
import SwitchButton from '../buttons/SwitchButton';
import { Footer } from '../other/CommonStyles';
import FishRow from '../other/FishRow';
import LoaderComponent from '../other/LoaderComponent';

const FishingWeightOptions = [
  { label: 'Sugautos žuvys', value: FishingWeighType.CAUGHT },
  { label: 'Visos žuvys', value: FishingWeighType.All },
];

const FishingWeight = ({ coordinates, isDisabled }: { coordinates: any; isDisabled: boolean }) => {
  const queryClient = useQueryClient();
  const [type, setType] = useState<FishingWeighType>(FishingWeighType.CAUGHT);
  const { fishTypes, isLoading } = useFishTypes();
  const isCaught = type === FishingWeighType.CAUGHT;
  const navigate = useNavigate();
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});

  const {
    data: fishingWeights = { preliminary: {}, total: {} },
    isLoading: fishingWeightsLoading,
  } = useQuery(['fishingWeights'], api.getFishingWeights, { retry: false });

  const hasFishOnBoat = !!Object.values(fishingWeights.preliminary || {}).length;

  const initialValues = fishTypes
    .filter((fishType) =>
      isCaught && hasFishOnBoat ? !!fishingWeights.preliminary[fishType.id] : true,
    )
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
        navigate(-1);
      },
      onError: () => {
        handleErrorToastFromServer();
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
    <>
      {hasFishOnBoat && (
        <SwitchButton options={FishingWeightOptions} value={type} onChange={setType} />
      )}
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
          disabled={fishingWeightLoading || isDisabled}
          onClick={handleSubmit}
        >
          Saugoti pakeitimus
        </StyledButton>
      </Footer>
    </>
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
