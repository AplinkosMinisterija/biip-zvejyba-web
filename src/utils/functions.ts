import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import api from './api';
import { LOCATION_ERRORS } from './constants';
import { routes } from './routes';
import { validationTexts } from './texts';
import { Profile, ProfileId, ResponseProps, UpdateTokenProps } from './types';

const cookies = new Cookies();

export const clearCookies = () => {
  cookies.remove('token', { path: '/' });
  cookies.remove('refreshToken', { path: '/' });
  cookies.remove('module', { path: '/' });
  cookies.remove('profileId', { path: '/' });
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
    },
  );
};

export const handleSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
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
          validationTexts.error,
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
      { enableHighAccuracy: true },
    );
  } else {
    onError(LOCATION_ERRORS.GEOLOCATION_NOT_SUPPORTE);
  }
};

export const getCurrentRoute = (pathname: any) => {
  return routes?.find((route: any) => route.regExp.test(pathname));
};

export const getLocationList = async (input: string, page: number | string, query: any) => {
  return await api.getLocations({ search: input, page, query });
};
