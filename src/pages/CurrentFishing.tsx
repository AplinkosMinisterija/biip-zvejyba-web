import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import FishingAction from '../components/containers/FishingAction';
import FishingLocation from '../components/containers/FishingLocation';
import DefaultLayout from '../components/layouts/DefaultLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import api from '../utils/api';
import { getCurrentRoute, useGeolocationWatcher, slugs } from '../utils';
export const CurrentFishing = () => {
  useGeolocationWatcher();
  const navigate = useNavigate();
  const currentRoute = getCurrentRoute(window.location.pathname);

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
    <DefaultLayout
      title={currentRoute?.title || ''}
      subtitle={currentRoute?.subtitle || ''}
      back={currentRoute?.back}
    >
      {currentRoute?.slug === slugs.fishingLocation && <FishingLocation />}
      {currentRoute?.slug === slugs.fishingCurrent && <FishingAction fishing={currentFishing} />}
    </DefaultLayout>
  );
};

export default CurrentFishing;
