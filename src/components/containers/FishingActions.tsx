import { useContext, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  computeFishingActionGuards,
  Fishing,
  FishingLocationOption,
  FishingTypeRoute,
  PopupContentType,
  slugs,
} from '../../utils';
import api from '../../utils/api';
import { Variant } from '../buttons/FishingLocationButton';
import LargeButton from '../buttons/LargeButton';
import LoaderComponent from '../other/LoaderComponent';
import { NotCheckedToolsPopup } from '../popups/NotCheckedToolsLocations';
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
  const [notCheckedLocations, setNotCheckedLocations] = useState<FishingLocationOption[]>([]);
  const checkingTools = useRef(false);

  const { data: fishingWeights, isLoading: fishingWeightsLoading } = useQuery(
    ['fishingWeights'],
    () => api.getFishingWeights(),
    {
      retry: false,
    },
  );

  const locationType = fishing?.type;
  const loading = fishingWeightsLoading;
  const { fishingComplete, shoreWeighingDisabled, finishDisabled } =
    computeFishingActionGuards(fishingWeights);

  const openShoreWeighing = async () => {
    if (checkingTools.current) return;
    checkingTools.current = true;
    const locations = await api.getNotCheckedToolsLocations().catch(() => []);
    checkingTools.current = false;
    if (locations?.length) setNotCheckedLocations(locations);
    else navigate(slugs.fishingWeight);
  };

  const closeNotCheckedWarning = () => {
    if (!notCheckedLocations.length) return;
    setNotCheckedLocations([]);
    navigate(slugs.fishingWeight);
  };

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <NotCheckedToolsPopup locations={notCheckedLocations} onClose={closeNotCheckedWarning} />
      <Container>
        <LargeButton
          variant={Variant.FLORAL_WHITE}
          title="Tikrinkite arba</br>statykite įrankius"
          subtitle="Esate žvejybos vietoje"
          buttonLabel="Atidaryti"
          onClick={() => {
            navigate(slugs.fishingTools(FishingTypeRoute[locationType]));
          }}
          isDisabled={fishingComplete}
        />
        <LargeButton
          variant={Variant.GHOST_WHITE}
          title="Žuvų svoris</br>krante"
          subtitle="Pasverkite bendrą svorį"
          buttonLabel="Sverti"
          isDisabled={shoreWeighingDisabled}
          onClick={openShoreWeighing}
        />
        <LargeButton
          variant={Variant.AZURE}
          title="Žvejybos baigimo</br>nustatymas"
          subtitle="Užbaikite žvejybą"
          buttonLabel="Baigti"
          onClick={() => showPopup({ type: PopupContentType.END_FISHING })}
          isDisabled={finishDisabled}
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
