import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton.tsx';
import styled from 'styled-components';
import Popup from '../layouts/Popup.tsx';
import Button, { ButtonColors } from '../buttons/Button.tsx';
import { useState } from 'react';
import { LocationType } from '../../utils/constants.ts';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api.ts';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../state/fishing/reducer.ts';
import { useNavigate } from 'react-router-dom';
import { slugs } from '../../utils/routes.tsx';
import { handleAlert } from '../../utils/functions.ts';
import { RootState } from '../../state/store.ts';

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
      <Popup visible={showStartFishing} onClose={() => setShowStartFishing(false)}>
        <PopupWrapper>
          <>
            <FishingImage src={'/startFishing.svg'} />
            <Heading>Žvejybos pradžia</Heading>
            <Description>Lengvai ir paprastai praneškite apie žvejybos pradžią</Description>
          </>
          <StyledButton
            radius="24px"
            onClick={handleStartFishing}
            loading={startLoading}
            disabled={startLoading || skipLoading}
          >
            Pradėti žvejybą
          </StyledButton>
          <StyledButton
            variant={ButtonColors.SECONDARY}
            radius="24px"
            onClick={handleSkipFishing}
            loading={skipLoading}
            disabled={startLoading || skipLoading}
          >
            Neplaukiu žvejoti
          </StyledButton>
        </PopupWrapper>
      </Popup>
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
const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
`;
const FishingImage = styled.img`
  width: 116px;
  height: 116px;
`;

const Heading = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
`;

const Description = styled.div`
  margin-bottom: 40px;
  line-height: 26px;
  text-align: center;
  font-weight: 500;
`;

const StyledButton = styled(Button)`
  font-size: 2rem;
  font-weight: 600;
  border-radius: 30px;
  height: 56px;
`;

export default FishingLocation;
