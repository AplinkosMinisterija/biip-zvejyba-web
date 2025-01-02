import { map } from 'lodash';
import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  LocationType,
  SickReasons,
  skipOptions,
  validationTexts,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton';
import SelectWaterBody from '../forms/SelectWaterBody';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';
import { LocationContext, LocationContextType } from '../other/LocationContext';

const FishingLocation = ({ isDisabled }: any) => {
  const queryClient = useQueryClient();
  const [showStartFishing, setShowStartFishing] = useState(false);
  const [showSkipFishing, setShowSkipFishing] = useState(false);
  const [skipReason, setSkipReason] = useState(SickReasons.BAD_WEATHER);
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const { coordinates, location, getLocation, locationLoading } =
    useContext<LocationContextType>(LocationContext);

  const { isLoading: skipLoading, mutateAsync: skipFishing } = useMutation(api.skipFishing, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => setShowSkipFishing(false),
    retry: false,
  });

  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('currentFishing');
    },
    retry: false,
  });

  const handleSelectLocation = (type: LocationType) => () => {
    setLocationType(type);
    if (type === LocationType.INLAND_WATERS) {
      getLocation(type);
      setShowLocationPopUp(true);
    } else {
      setShowStartFishing(true);
    }
  };

  const handleStartFishing = () => {
    if (coordinates && locationType) {
      startFishing({
        type: locationType,
        coordinates,
        uetkCadastralId: location?.id,
      });
    } else {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }
  };

  const handleSkipFishing = () => {
    if (locationType && coordinates) {
      skipFishing({ type: locationType, coordinates: coordinates, note: skipReason });
    } else {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }
  };

  const disabledButtons = startLoading || skipLoading;

  return (
    <>
      <Container>
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Kuršių mariose"
          image={'/marios.png'}
          onClick={handleSelectLocation(LocationType.ESTUARY)}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Vidaus vandenyse"
          image={'/vidaus_vandens_telkiniai.png'}
          onClick={handleSelectLocation(LocationType.INLAND_WATERS)}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Polderiuose"
          image={'/polderiai.png'}
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
      <PopUpWithImage
        title={'Kur žvejosite?'}
        iconName={IconName.startFishing}
        visible={showLocationPopUp}
        onClose={() => setShowLocationPopUp(false)}
      >
        <SelectWaterBody onStartFishing={handleStartFishing} loading={locationLoading} />
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
