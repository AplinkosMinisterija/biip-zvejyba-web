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
  const [warning, setWarning] = useState<{
    locations: FishingLocationOption[];
    continueAction: () => void;
  }>();
  const refetching = useRef(false);

  const {
    data: fishingWeights,
    isLoading: fishingWeightsLoading,
    refetch: refetchFishingWeights,
  } = useQuery(['fishingWeights'], () => api.getFishingWeights(), {
    retry: false,
  });

  const locationType = fishing?.type;
  const loading = fishingWeightsLoading;
  const { fishingComplete, shoreWeighingDisabled, finishDisabled } =
    computeFishingActionGuards(fishingWeights);

  // Refetch on click: the cached payload predates checks made on the tools screen.
  const warnIfToolsUnchecked = (continueAction: () => void) => async () => {
    if (refetching.current) return;
    refetching.current = true;
    const { data } = await refetchFishingWeights();
    refetching.current = false;
    const locations = data?.unfinishedCheckLocations ?? [];
    if (locations.length) setWarning({ locations, continueAction });
    else continueAction();
  };

  const closeWarning = () => {
    setWarning(undefined);
    warning?.continueAction();
  };

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <NotCheckedToolsPopup locations={warning?.locations ?? []} onClose={closeWarning} />
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
          onClick={warnIfToolsUnchecked(() => navigate(slugs.fishingWeight))}
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
