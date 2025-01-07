import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import FishingActions from '../components/containers/FishingActions';
import FishingLocation from '../components/containers/FishingLocation';
import FishingTools from '../components/containers/FishingTools';
import FishingToolWeight from '../components/containers/FishingToolWeight';
import FishingWeight from '../components/containers/FishingWeight';
import DefaultLayout from '../components/layouts/DefaultLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  getCurrentRoute,
  handleErrorToast,
  LOCATION_ERRORS,
  PopupContentType,
  slugs,
  validationTexts,
} from '../utils';
import api from '../utils/api';
import { LocationContext, LocationContextType } from '../components/providers/LocationContext';
import { PopupContext, PopupContextProps } from '../components/providers/PopupProvider';

export const CurrentFishing = () => {
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const { coordinates, error } = useContext<LocationContextType>(LocationContext);
  const currentRoute = getCurrentRoute(window.location.pathname);

  useEffect(() => {
    if (error === LOCATION_ERRORS.POSITION_UNAVAILABLE) {
      handleErrorToast(validationTexts.failedToSetLocation);
    }
    showPopup({
      type: PopupContentType.LOCATION_PERMISSION,
      content: {},
    });
  }, [error]);

  const { data: currentFishing, isLoading: currentFishingLoading } = useQuery(
    ['currentFishing'],
    () => api.getCurrentFishing(),
    {
      retry: false,
    },
  );

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

  const isDisabled = !coordinates;

  return (
    <DefaultLayout>
      {currentFishing?.id ? (
        <FishingLocation isDisabled={isDisabled} coordinates={coordinates} />
      ) : (
        <>
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
        </>
      )}
    </DefaultLayout>
  );
};

export default CurrentFishing;
