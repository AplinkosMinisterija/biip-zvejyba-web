import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { actions as fishingActions } from '../state/fishing/reducer';
import { actions, initialState } from '../state/user/reducer';
import api from './api';
import { LOCATION_ERRORS, RolesTypes, ServerErrors } from './constants';
import { clearCookies, handleAlert, handleSetProfile } from './functions';

import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { RootState } from '../state/store';
import { routes } from './routes';
import { User } from './types';

const cookies = new Cookies();

export const useCheckAuthMutation = () => {
    const dispatch = useDispatch();
    const token = cookies.get('token');

    const { isLoading } = useQuery([token], () => api.checkAuth(), {
        onError: ({ response }: any) => {
            if (response.status === ServerErrors.NO_PERMISSION) {
                clearCookies();
                dispatch(actions.setUser(initialState));

                return;
            }

            return handleAlert();
        },
        onSuccess: (data: User) => {
            if (data) {
                handleSetProfile(data?.profiles);
                dispatch(actions.setUser({ userData: data, loggedIn: true }));
            }
        },
        retry: false,
        enabled: !!token,
    });

    return { isLoading };
};

export const useEGatesSign = () => {
    const { mutateAsync, isLoading } = useMutation(api.eGatesSign, {
        onError: () => {
            handleAlert();
        },
        onSuccess: ({ url }) => {
            window.location.replace(url);
        },
        retry: false,
    });
    return { isLoading, mutateAsync };
};

export const useGetCurrentProfile = () => {
    const profiles = useSelector((state: RootState) => state.user.userData.profiles);
    const profileId = cookies.get('profileId');
    const currentProfile = profiles?.find((profile) => profile.id == profileId);
    return currentProfile;
};
export const useFilteredRoutes = () => {
    const profile = useGetCurrentProfile();
    return routes.filter((route: any) => {
        if (!route?.slug) return false;

        if (route.tenantOwner) {
            return [RolesTypes.USER_ADMIN, RolesTypes.OWNER].some((r) => r === profile?.role);
        }
        return true;
    });
};

export const useLogoutMutation = () => {
    const dispatch = useDispatch();
    const { mutateAsync } = useMutation(() => api.logout(), {
        onError: () => {
            handleAlert();
        },
        onSuccess: () => {
            clearCookies();
            dispatch(actions.setUser(initialState));
        },
    });
    return { mutateAsync };
};

export const useGeolocationWatcher = () => {
    const options = {
        enableHighAccuracy: true,
        timeout: 100000,
    };
    const dispatch = useDispatch();
    useEffect(() => {
        const successHandler = (position: any) => {
            dispatch(fishingActions.setError(null));
            console.log('coordinates', {
                x: position.coords.longitude,
                y: position.coords.latitude,
            });
            dispatch(
                fishingActions.setCoordinates({
                    x: position.coords.longitude,
                    y: position.coords.latitude,
                })
            );
        };
        const errorHandler = () => {
            dispatch(fishingActions.setError(LOCATION_ERRORS.POINT_NOT_FOUND));
        };
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
        const id = navigator.geolocation.watchPosition(successHandler, errorHandler, options);
        return () => navigator.geolocation.clearWatch(id);
    }, []);
    return {};
};

export const useWindowSize = (width: string) => {
    const [isInRange, setIsInRange] = useState(false);

    const handleResize = () => {
        const mediaQuery = window.matchMedia(width);
        setIsInRange(mediaQuery.matches);
    };

    useEffect(() => {
        handleResize();
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isInRange;
};
