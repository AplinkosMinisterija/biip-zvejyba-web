import Cookies from 'universal-cookie';
import { initialState } from '../state/user/reducer.ts';
import api from './api.ts';
import { toast } from 'react-toastify';
import { validationTexts } from './texts.ts';
import { Profile, ProfileId, ResponseProps, UpdateTokenProps } from './types.ts';
import { LOCATION_ERRORS } from './constants.ts';

const cookies = new Cookies();

export const clearCookies = () => {
    cookies.remove('token', { path: '/' });
    cookies.remove('refreshToken', { path: '/' });
    cookies.remove('module', { path: '/' });
    cookies.remove('profileId', { path: '/' });
};

export const handleGetCurrentUser = async () => {
    if (!cookies.get('token')) return initialState;
    return { userData: await api.checkAuth(), loggedIn: true };
};

export const handleAlert = (responseError: string = 'error') => {
    toast.error(
        validationTexts[responseError as keyof typeof validationTexts] || validationTexts.error,
        {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        }
    );
};

export const handleSetProfile = (profiles?: Profile[], justLoggedIn: boolean = false) => {
    const isOneProfile = profiles?.length === 1;
    const profileId = cookies.get('profileId');

    if (profileId && justLoggedIn) {
        const hasProfile = profiles?.some((profile) => profile.id == profileId);

        if (hasProfile) {
            handleSelectProfile(profileId);
        } else {
            cookies.remove('profileId', { path: '/' });
        }
    } else if (isOneProfile) {
        handleSelectProfile(profiles[0].id);
    }
};

export const handleSelectProfile = (profileId: ProfileId) => {
    if (cookies.get('profileId') == profileId) return;
    cookies.set('profileId', `${profileId}`, { path: '/' });
    window.location.reload();
};

export const handleUpdateTokens = (data: UpdateTokenProps) => {
    const { token, refreshToken, error } = data;
    if (token) {
        cookies.set('token', `${token}`, {
            path: '/',
            expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
        });

        if (refreshToken) {
            cookies.set('refreshToken', `${refreshToken}`, {
                path: '/',
                expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
            });
        }
    }
    if (error) {
        return { error };
    }
};

export const handleResponse = async ({
    endpoint,
    onSuccess,
    onError,
    onOffline = () => {},
}: ResponseProps) => {
    const isOnline = getOnLineStatus();
    if (isOnline) {
        const response: any = await endpoint();
        if (onError && response?.error) {
            return onError(
                validationTexts[response.error.type!] ||
                    validationTexts[response.error.message!] ||
                    validationTexts.error
            );
        }

        if (!response || response?.error) {
            return handleAlert(response.error.type!);
        }

        return onSuccess(response);
    } else {
        return onOffline();
    }
};

export const getOnLineStatus = () =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

export const getCurrentLocation = ({
    onSuccess,
    onError,
}: {
    onSuccess: (position: { lat: number; lng: number }) => void;
    onError: (e: LOCATION_ERRORS, data?: any) => void;
}) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {});
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position?.coords) {
                    onSuccess({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                }
            },
            (e) => {
                onError(LOCATION_ERRORS.POINT_NOT_FOUND, e);
            },
            { enableHighAccuracy: true }
        );
    } else {
        onError(LOCATION_ERRORS.GEOLOCATION_NOT_SUPPORTE);
    }
};

export const watchLocation = (): any => {
    navigator.geolocation.getCurrentPosition(() => {});
    return navigator.geolocation.watchPosition(
        (position) => {
            if (position?.coords) {
                //TODO: set state
            }
        },
        () => {
            //TODO: set state
        },
        { enableHighAccuracy: true, timeout: 100000 }
    );
};
