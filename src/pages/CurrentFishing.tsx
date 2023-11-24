import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import FishingActions from '../components/containers/FishingActions';
import FishingLocation from '../components/containers/FishingLocation';
import DefaultLayout from '../components/layouts/DefaultLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import api from '../utils/api';
import { getCurrentRoute, useGeolocationWatcher, slugs, Ids } from '../utils';
import FishingTools from '../components/containers/FishingTools';
import FishingToolWeight from '../components/containers/FishingToolWeight';
import FishingWeight from '../components/containers/FishingWeight';
export const CurrentFishing = () => {
  const { coordinates } = useGeolocationWatcher();
  const navigate = useNavigate();
  const currentRoute = getCurrentRoute(window.location.pathname);
  const [location, setLocation] = useState();

  useEffect(() => {
    if (currentRoute?.slug === slugs.fishingLocation || currentRoute?.slug === slugs.fishingCurrent)
      setLocation(undefined);
  }, [currentRoute?.slug]);

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

  return (
    <DefaultLayout>
      {currentRoute?.slug === slugs.fishingLocation && <FishingLocation />}
      {currentRoute?.slug === slugs.fishingCurrent && (
        <FishingActions fishing={currentFishing} coordinates={coordinates} />
      )}
      {currentRoute?.slug === slugs.fishingTools && (
        <FishingTools setLocation={setLocation} location={location} coordinates={coordinates} />
      )}
      {currentRoute?.slug === slugs.fishingToolCaughtFishes(':toolId') && (
        <FishingToolWeight location={location} coordinates={coordinates} />
      )}
      {currentRoute?.slug === slugs.fishingWeight && <FishingWeight coordinates={coordinates} />}
    </DefaultLayout>
  );
};

export default CurrentFishing;
