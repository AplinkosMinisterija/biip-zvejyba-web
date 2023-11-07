import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../state/store';
import api from '../../utils/api';
import { LocationType } from '../../utils/constants';
import { handleAlert } from '../../utils/functions';
import Button, { ButtonColors } from '../buttons/Button';
import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { IconName } from '../other/Icon';

const FishingLocation = () => {
  const queryClient = useQueryClient();
  const [showStartFishing, setShowStartFishing] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);
  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: () => {
      //TODO: display error
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('currentFishing');
    },
    retry: false,
  });

  const { isLoading: skipLoading, mutateAsync: skipFishing } = useMutation(api.skipFishing, {
    onError: () => {
      //TODO: display error
    },
    onSuccess: () => {
      //TODO: display success message
    },
    retry: false,
  });

  const handleSelectLocation = (type: LocationType) => () => {
    setLocation(type);
    setShowStartFishing(true);
  };

  const handleStartFishing = () => {
    if (coordinates && location) {
      startFishing({
        type: location,
        coordinates,
      });
    } else {
      handleAlert('Nepavyko nustatyti lokacijos');
    }
  };

  const handleSkipFishing = () => {
    if (location) {
      skipFishing({ type: location });
    }
  };

  const disabledButtons = startLoading || skipLoading;

  return (
    <>
      <Container>
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          title="Kuršių mariose"
          image={'/marios.avif'}
          onClick={handleSelectLocation(LocationType.ESTUARY)}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          title="Vidaus vandenyse"
          image={'/vidaus_vandens_telkiniai.avif'}
          onClick={handleSelectLocation(LocationType.INLAND_WATERS)}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          title="Polderiuose"
          image={'/polderiai.avif'}
          onClick={handleSelectLocation(LocationType.POLDERS)}
        />
      </Container>
      <PopUpWithImage
        iconName={IconName.startFishing}
        visible={showStartFishing}
        onClose={() => setShowStartFishing(false)}
        title={'Žvejybos pradžia'}
        description={'Lengvai ir paprastai praneškite apie žvejybos pradžią'}
      >
        <Button loading={startLoading} disabled={disabledButtons} onClick={handleStartFishing}>
          {'Pradėti žvejybą'}
        </Button>
        <Button
          loading={skipLoading}
          disabled={disabledButtons}
          variant={ButtonColors.SECONDARY}
          onClick={handleSkipFishing}
        >
          {'Neplaukiu žvejoti'}
        </Button>
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

export default FishingLocation;
