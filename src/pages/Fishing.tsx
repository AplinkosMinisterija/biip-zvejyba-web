import DefaultLayout from '../components/layouts/DefaultLayout.tsx';
import FishingAction from '../components/containers/FishingAction.tsx';
import { useEffect, useState } from 'react';
import FishingLocation from '../components/containers/FishingLocation.tsx';
import { watchLocation } from '../utils/functions.ts';

const contentConfig: any = {
    location: {
        title: 'Kur žvejosite?',
        subtitle: 'Pasirinkite žvejybos vietą',
        container: <FishingLocation />,
    },
    action: {
        title: 'Mano žvejyba',
        subtitle: 'Pasirinkite žvejybos veiksmą',
        container: <FishingAction />,
    },
};
export const Fishing = () => {
    const [content] = useState('action');
    const page = contentConfig[content];

    useEffect(() => {
        const watchId = watchLocation();
        return navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <DefaultLayout title={page.title} subtitle={page.subtitle}>
            {page.container}
        </DefaultLayout>
    );
};

export default Fishing;
