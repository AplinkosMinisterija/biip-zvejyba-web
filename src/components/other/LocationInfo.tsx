import { useState } from 'react';
import styled from 'styled-components';
import { device, LocationType } from '../../utils';
import Button, { ButtonColors } from '../buttons/Button';
import LocationForm from '../forms/LocationForm';
import PopUpWithImage from '../layouts/PopUpWithImage';
import LoaderComponent from '../other/LoaderComponent';
import NotCheckedToolsLocations from '../popups/NotCheckedToolsLocations';
import { IconContainer } from './CommonStyles';
import Icon, { IconName } from './Icon';

const LocationInfo = ({
  location,
  locationLoading,
  setLocationManually,
  locationType,
  renewLocation,
}: any) => {
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);

  const loadingMessage =
    locationType === LocationType.POLDERS
      ? 'Nustatoma jūsų buvimo vieta '
      : 'Nenustatytas vandens telkinys';

  return (
    <>
      <NotCheckedToolsLocations location={location} />
      <TitleWrapper>
        <Title>{location?.name || loadingMessage}</Title>
        {setLocationManually && (
          <IconContainer onClick={() => setShowLocationPopUp(true)}>
            <EditIcon name={IconName.edit} />
          </IconContainer>
        )}
      </TitleWrapper>
      {locationLoading && <LoaderComponent />}
      {!location && !locationLoading && (
        <>
          <Message>
            Nepavyko nustatyti jūsų buvimo vietos. Nustatykite rankiniu būdu arba nuplaukite į
            žvejybos vietą ir atnaujinkite informaciją.
          </Message>
          <Button
            onClick={() => {
              setShowLocationPopUp(true);
            }}
          >
            {'Nustatyti rankiniu būdu'}
          </Button>
          <Button
            loading={locationLoading}
            variant={ButtonColors.SECONDARY}
            onClick={renewLocation}
          >
            {'Atnaujinti lokaciją'}
          </Button>
        </>
      )}
      <PopUpWithImage visible={showLocationPopUp} onClose={() => setShowLocationPopUp(false)}>
        <LocationForm
          handleSetLocationManually={(l: any) => {
            setLocationManually(l);
          }}
          locationType={locationType}
          onClose={() => setShowLocationPopUp(false)}
        />
      </PopUpWithImage>
    </>
  );
};

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const EditIcon = styled(Icon)`
  font-size: 2.4rem;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  margin: 16px 0;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

export default LocationInfo;
