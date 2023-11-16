import { map } from 'lodash';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../state/store';
import { buttonLabels, skipOptions } from '../../utils';
import api from '../../utils/api';
import { LocationType, SickReasons } from '../../utils';
import { handleAlert } from '../../utils';
import Button, { ButtonColors } from '../buttons/Button';
import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';

const FishingLocation = () => {
  const queryClient = useQueryClient();
  const [showStartFishing, setShowStartFishing] = useState(false);
  const [showSkipFishing, setShowSkipFishing] = useState(false);
  const [skipReason, setSkipReason] = useState(SickReasons.BAD_WEATHER);
  const [location, setLocation] = useState<LocationType | null>(null);
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);

  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }) => {
      handleAlert(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('currentFishing');
    },
    retry: false,
  });

  const { isLoading: skipLoading, mutateAsync: skipFishing } = useMutation(api.skipFishing, {
    onError: ({ response }) => {
      handleAlert(response);
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
    if (location && coordinates) {
      skipFishing({ type: location, coordinates: coordinates });
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
        <Grid $columns={2}>
          <Button loading={startLoading} disabled={disabledButtons} onClick={handleStartFishing}>
            {buttonLabels.startFishing}
          </Button>
          <Button
            loading={skipLoading}
            disabled={disabledButtons}
            variant={ButtonColors.SECONDARY}
            onClick={() => {
              setShowStartFishing(false);
              setShowSkipFishing(true);
            }}
          >
            {buttonLabels.cantFishing}
          </Button>
        </Grid>
      </PopUpWithImage>
      <PopUpWithImage
        visible={showSkipFishing}
        onClose={() => setShowSkipFishing(false)}
        title={'Neplaukiu žvejoti'}
        description={'Pasirinkite priežastį, dėl ko negalite žvejoti'}
      >
        <Grid $columns={3}>
          {map(skipOptions, (item, index) => (
            <SelectButton
              $selected={item.value === skipReason}
              key={`skip-reasons-${index}`}
              onClick={() => setSkipReason(item.value)}
            >
              {item.label}
            </SelectButton>
          ))}
        </Grid>
        <Grid $columns={2}>
          <Button loading={startLoading} disabled={disabledButtons} onClick={handleSkipFishing}>
            {buttonLabels.save}
          </Button>
          <Button
            loading={skipLoading}
            disabled={disabledButtons}
            variant={ButtonColors.TRANSPARENT}
            onClick={() => setShowSkipFishing(false)}
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

const SelectButton = styled.button<{ $selected: boolean }>`
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  background-color: ${({ $selected, theme }) =>
    $selected ? '#f5f6fe' : theme.colors.cardBackground.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.colors.primary : 'transparent')};
  cursor: pointer;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default FishingLocation;
