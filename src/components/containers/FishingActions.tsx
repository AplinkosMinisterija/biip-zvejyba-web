import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Fishing, FishingTypeRoute, LocationType, PopupContentType, slugs } from '../../utils';
import api from '../../utils/api';
import { Variant } from '../buttons/FishingLocationButton';
import LargeButton from '../buttons/LargeButton';
import LoaderComponent from '../other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

// Extend the Window interface to include the `coordinates` property
declare global {
  interface Window {
    coordinates?: { x: number; y: number };
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
    api.getFishingWeights,
    {
      retry: false,
    },
  );

  const loading = fishingWeightsLoading;

  const weightOnBoatExist =
    !!fishingWeights?.preliminary && !!Object.keys(fishingWeights.preliminary).length;
  const weightOnShoreExist = !!fishingWeights?.total && !!Object.keys(fishingWeights.total).length;

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <Container>
        <LargeButton
          variant={Variant.FLORAL_WHITE}
          title={
            fishing?.type === LocationType.INLAND_WATERS
              ? 'Statykite arba</br>ištraukite įrankius'
              : 'Tikrinkite arba</br>statykite įrankius'
          }
          subtitle="Esate žvejybos vietoje"
          buttonLabel="Atidaryti"
          onClick={() => {
            navigate(slugs.fishingTools(FishingTypeRoute[fishing.type]));
          }}
          isDisabled={weightOnBoatExist}
        />
        <LargeButton
          variant={Variant.GHOST_WHITE}
          title="Žuvies svoris</br>krante"
          subtitle="Pasverkite bendrą svorį"
          buttonLabel="Sverti"
          onClick={() => {
            navigate(slugs.fishingWeight);
          }}
          isDisabled={!weightOnBoatExist || weightOnShoreExist}
        />
        <LargeButton
          variant={Variant.AZURE}
          title="Žvejybos baigimo</br>nustatymas"
          subtitle="Užbaikite žvejybą"
          buttonLabel="Baigti"
          onClick={() => showPopup({ type: PopupContentType.END_FISHING })}
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
