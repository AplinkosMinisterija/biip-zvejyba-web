import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonColors } from '../components/buttons/Button';
import FishingActions from '../components/containers/FishingActions';
import FishingLocation from '../components/containers/FishingLocation';
import FishingTools from '../components/containers/FishingTools';
import FishingToolWeight from '../components/containers/FishingToolWeight';
import FishingWeight from '../components/containers/FishingWeight';
import DefaultLayout from '../components/layouts/DefaultLayout';
import PopUpWithImage from '../components/layouts/PopUpWithImage';
import { Grid } from '../components/other/CommonStyles';
import { IconName } from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  getCurrentRoute,
  handleErrorToast,
  LOCATION_ERRORS,
  slugs,
  validationTexts,
} from '../utils';
import api from '../utils/api';
import { LocationContext, LocationContextType } from '../components/other/LocationContext';

const infoToEnableTheLocationUrl = 'https://zuvys.biip.lt/dokumentacija/zvejyba/lokacija/';

export const CurrentFishing = () => {
  const { coordinates, error } = useContext<LocationContextType>(LocationContext);
  const navigate = useNavigate();
  const currentRoute = getCurrentRoute(window.location.pathname);
  const [showLocationDeniedPopUp, setShowLocationDeniedPopUp] = useState(false);

  useEffect(() => {
    if (error === LOCATION_ERRORS.POSITION_UNAVAILABLE) {
      handleErrorToast(validationTexts.failedToSetLocation);
    }

    setShowLocationDeniedPopUp(error === LOCATION_ERRORS.POINT_NOT_FOUND);
  }, [error]);

  const { data: currentFishing, isLoading: currentFishingLoading } = useQuery(
    ['currentFishing'],
    () => api.getCurrentFishing(),
    {
      retry: false,
    },
  );

  useEffect(() => {
    if (!currentFishingLoading) {
      if (currentFishing && currentRoute?.slug === slugs.fishingLocation) {
        navigate(slugs.fishingCurrent);
      } else if (!currentFishing && currentRoute?.slug !== slugs.fishingLocation) {
        navigate(slugs.fishingLocation);
      }
    }
  }, [currentFishing, window.location.pathname]);

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

  const isDisabled = !coordinates;

  return (
    <DefaultLayout>
      <PopUpWithImage
        onClose={() => setShowLocationDeniedPopUp(false)}
        iconName={IconName.location}
        visible={showLocationDeniedPopUp}
        title={'Geografinės vietos leidimas'}
        description={
          'Norint naudotis elektroniniu žvejybos žurnalu, prašome suteikti leidimą naudotis jūsų geografinę vietą.'
        }
      >
        <Grid>
          <Button
            onClick={() => {
              window.location.href = infoToEnableTheLocationUrl;
            }}
          >
            {'Skaityti instrukciją'}
          </Button>
          <Button
            variant={ButtonColors.SECONDARY}
            onClick={() => setShowLocationDeniedPopUp(false)}
          >
            {'Žinau kaip suteikti leidimą'}
          </Button>
        </Grid>
      </PopUpWithImage>

      {currentRoute?.slug === slugs.fishingLocation && (
        <FishingLocation isDisabled={isDisabled} coordinates={coordinates} />
      )}
      {currentRoute?.slug === slugs.fishingCurrent && (
        <FishingActions
          isDisabled={isDisabled}
          fishing={currentFishing}
          coordinates={coordinates}
        />
      )}
      {currentRoute?.slug === slugs.fishingTools && <FishingTools />}
      {currentRoute?.slug === slugs.fishingToolCaughtFishes(':toolId') && (
        <FishingToolWeight isDisabled={isDisabled} coordinates={coordinates} />
      )}
      {currentRoute?.slug === slugs.fishingWeight && (
        <FishingWeight isDisabled={isDisabled} coordinates={coordinates} />
      )}
    </DefaultLayout>
  );
};

export default CurrentFishing;
