import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Fishing,
  FishingTypeRoute,
  isShoreOnlyWeighing,
  PopupContentType,
  slugs,
} from '../../utils';
import api from '../../utils/api';
import { Variant } from '../buttons/FishingLocationButton';
import LargeButton from '../buttons/LargeButton';
import LoaderComponent from '../other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

// Extend the Window interface to include the `coordinates` property
declare global {
  interface Window {
    coordinates?: { x: number; y: number };
    coordinatesError?: string;
  }
}

interface FishingActionsProps {
  fishing: Fishing;
}

const FishingActions = ({ fishing }: FishingActionsProps) => {
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const navigate = useNavigate();

  const { data: fishingWeights, isLoading: fishingWeightsLoading } = useQuery(
    ['fishingWeights'],
    () => api.getFishingWeights(),
    {
      retry: false,
    },
  );

  const locationType = fishing?.type;

  const loading = fishingWeightsLoading;

  const hasFishAmount = (record?: Record<string, unknown>) =>
    !!record && Object.values(record).some((amount) => Number(amount) > 0);

  const weightOnBoatExist = hasFishAmount(fishingWeights?.preliminary);

  const weightOnShoreExist = hasFishAmount(fishingWeights?.total);

  const isDisabled = !isShoreOnlyWeighing(locationType) && weightOnShoreExist;

  const shoreWeighingDisabled = isDisabled || !weightOnBoatExist;

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <Container>
        <LargeButton
          variant={Variant.FLORAL_WHITE}
          title={
            isShoreOnlyWeighing(locationType)
              ? 'Statykite arba</br>ištraukite įrankius'
              : 'Tikrinkite arba</br>statykite įrankius'
          }
          subtitle="Esate žvejybos vietoje"
          buttonLabel="Atidaryti"
          onClick={() => {
            navigate(slugs.fishingTools(FishingTypeRoute[locationType]));
          }}
          isDisabled={isDisabled}
        />
        <LargeButton
          variant={Variant.GHOST_WHITE}
          title="Žuvies svoris</br>krante"
          subtitle="Pasverkite bendrą svorį"
          buttonLabel="Sverti"
          isDisabled={shoreWeighingDisabled}
          onClick={() => {
            navigate(slugs.fishingWeight);
          }}
        />
        <LargeButton
          variant={Variant.AZURE}
          title="Žvejybos baigimo</br>nustatymas"
          subtitle="Užbaikite žvejybą"
          buttonLabel="Baigti"
          onClick={() => showPopup({ type: PopupContentType.END_FISHING })}
          isDisabled={
            !isShoreOnlyWeighing(locationType) && weightOnBoatExist && !weightOnShoreExist
          }
        />
      </Container>
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
