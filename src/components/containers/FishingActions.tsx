import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  buttonLabels,
  handleAlert,
  handleSuccessToast,
  LocationType,
  validationTexts,
  slugs,
  Fishing,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import { Variant } from '../buttons/FishingLocationButton';
import LargeButton from '../buttons/LargeButton';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

interface FishingActionsProps {
  fishing: Fishing;
}
const FishingActions = ({ fishing }: FishingActionsProps) => {
  const queryClient = useQueryClient();
  const [showFinishFishing, setShowFinishFishing] = useState(false);
  const navigate = useNavigate();
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);

  const { mutateAsync: finishFishing, isLoading: finishFishingLoading } = useMutation(
    api.finishFishing,
    {
      onError: ({ response }) => {
        handleAlert(response);
      },
      onSuccess: () => {
        handleSuccessToast(validationTexts.fishingFinished);
        queryClient.invalidateQueries('currentFishing');
      },
      retry: false,
    },
  );

  const { data: fishingWeights, isLoading: fishingWeightsLoading } = useQuery(
    ['fishingWeights'],
    api.getFishingWeights,
    {
      retry: false,
    },
  );

  const handleFinishFishing = () => {
    if (coordinates) {
      finishFishing({ coordinates });
    }
  };

  const loading = finishFishingLoading || fishingWeightsLoading;

  const canWeigh =
    fishing?.type === LocationType.INLAND_WATERS ||
    !!Object.keys(fishingWeights?.preliminary || {})?.length;

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <Container>
        <LargeButton
          variant={Variant.FLORAL_WHITE}
          title="Tikrinkite arba</br>statykite įrankius"
          subtitle="Esate žvejybos vietoje"
          buttonLabel="Atidaryti"
          onClick={() => {
            navigate(slugs.fishingTools);
          }}
        />
        {canWeigh && (
          <LargeButton
            variant={Variant.GHOST_WHITE}
            title="Žuvies svoris</br>krante"
            subtitle="Pasverkite bendrą svorį"
            buttonLabel="Sverti"
            onClick={() => {
              navigate(slugs.fishingWeight);
            }}
          />
        )}
        <LargeButton
          variant={Variant.AZURE}
          title="Žvejybos baigimo</br>nustatymas"
          subtitle="Užbaikite žvejybą"
          buttonLabel="Baigti"
          onClick={() => setShowFinishFishing(true)}
        />
      </Container>
      <PopUpWithImage
        iconName={IconName.endFishing}
        visible={showFinishFishing}
        onClose={() => setShowFinishFishing(false)}
        title={'Žvejybos pabaiga'}
        description={'Ar esate tikri, kad norite baigti žvejybą?'}
      >
        <Grid $columns={2}>
          <Button
            loading={finishFishingLoading}
            disabled={finishFishingLoading}
            onClick={handleFinishFishing}
          >
            {buttonLabels.endFishing}
          </Button>
          <Button
            disabled={finishFishingLoading}
            variant={ButtonColors.SECONDARY}
            onClick={() => {
              setShowFinishFishing(false);
            }}
          >
            {buttonLabels.cancel}
          </Button>
        </Grid>
      </PopUpWithImage>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 40px;
`;

export default FishingActions;
