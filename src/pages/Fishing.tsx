import DefaultLayout from '../components/layouts/DefaultLayout';
import FishingAction from '../components/containers/FishingAction';
import { useEffect } from 'react';
import FishingLocation from '../components/containers/FishingLocation';
import { useGeolocationWatcher } from '../utils/hooks';
import { getCurrentRoute } from '../utils/functions.ts';
import { useNavigate } from 'react-router-dom';
import { slugs } from '../utils/routes.tsx';
import { useQuery } from 'react-query';
import api from '../utils/api.ts';
import LoaderComponent from '../components/other/LoaderComponent';
import FishingTools from '../components/containers/FishingTools';
import FishingWeight from '../components/containers/FishingWeight';
export const Fishing = () => {
    const navigate = useNavigate();
    const currentRoute = getCurrentRoute(window.location.pathname);

    const { data: currentFishing, isLoading: currentFishingLoading } = useQuery(
        ['currentFishing'],
        () => api.getCurrentFishing(),
        {}
    );

    useEffect(() => {
        if (!currentFishingLoading) {
            if (currentFishing && currentRoute?.slug === slugs.fishingLocation) {
                navigate(slugs.fishing(currentFishing.id));
            } else if (!currentFishing && currentRoute?.slug !== slugs.fishingLocation) {
                navigate(slugs.fishingLocation);
            }
        }
    }, [currentFishing, window.location.pathname]);

    useGeolocationWatcher();

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
            {currentRoute?.slug === slugs.fishing(':fishingId') && (
                <FishingAction fishing={currentFishing} />
            )}
            {currentRoute?.slug === slugs.fishingTools(':fishingId') && (
                <FishingTools fishing={currentFishing} />
            )}
            {currentRoute?.slug === slugs.fishingWeight(':fishingId') && (
                <FishingWeight fishing={currentFishing} />
            )}
        </DefaultLayout>
    );
};

export default Fishing;
