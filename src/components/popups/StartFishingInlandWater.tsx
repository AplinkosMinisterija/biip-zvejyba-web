import { IconName } from '../other/Icon';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import {
  buttonLabels,
  getLocationList,
  handleErrorToast,
  handleErrorToastFromServer,
  LocationType,
  validationTexts,
} from '../../utils';
import { Grid } from '../other/CommonStyles';
import Button from '../buttons/Button';
import styled from 'styled-components';
import AsyncSelectField from '../fields/AsyncSelect';
import { useState } from 'react';

const StartFishingInlandWater = ({ onClose }: any) => {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<any>();

  const getInputValue = (location: any) =>
    location ? `${location?.name}, ${location?.cadastralId}` : '';

  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries('currentFishing');
      onClose();
    },
    retry: false,
  });

  const handleStartFishing = () => {
    const coordinates = window.coordinates;
    if (coordinates) {
      startFishing({
        type: LocationType.INLAND_WATERS,
        coordinates: { x: coordinates?.x, y: coordinates?.y },
        uetkCadastralId: selectedLocation?.cadastralId,
      });
    } else {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }
  };

  return (
    <PopUpWithImage
      title={'Kur žvejosite?'}
      iconName={IconName.startFishing}
      visible={true}
      onClose={onClose}
    >
      <Container>
        <TitleWrapper>
          {selectedLocation ? (
            <>
              <LocationName>{`${selectedLocation?.name} (${selectedLocation?.municipality})`}</LocationName>
              <LocationId>{selectedLocation?.cadastralId}</LocationId>
            </>
          ) : (
            <></>
          )}
        </TitleWrapper>
        <StyledSelectField
          name={'location'}
          value={selectedLocation}
          label={'Pasirinkite vandens telkinį'}
          onChange={(location) => {
            setSelectedLocation(location);
          }}
          getOptionValue={(option) => option?.cadastralId}
          getOptionLabel={getInputValue}
          loadOptions={(input: string, page: number | string) => getLocationList(input, page)}
          inputValue={getInputValue(selectedLocation)}
        />
        <Grid $columns={1}>
          <Button loading={startLoading} disabled={startLoading} onClick={handleStartFishing}>
            {buttonLabels.startFishing}
          </Button>
        </Grid>
      </Container>
    </PopUpWithImage>
  );
};

const Container = styled.div`
  width: 100%;
`;

const LocationName = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
`;

const LocationId = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin: 16px 0;
`;

const StyledSelectField = styled(AsyncSelectField)`
  margin-bottom: 16px;
`;

export default StartFishingInlandWater;
