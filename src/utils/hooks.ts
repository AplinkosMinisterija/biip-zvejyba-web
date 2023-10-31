import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import api from './api.ts';
import { LOCATION_ERRORS, RolesTypes, ServerErrors } from './constants.ts';
import { clearCookies, handleAlert, handleGetCurrentUser, handleSetProfile } from './functions.ts';
import { actions, initialState, UserReducerProps } from '../state/user/reducer';
import { actions as fishingActions } from '../state/fishing/reducer';

import { RootState } from '../state/store.ts';
import Cookies from 'universal-cookie';
import { routes } from './routes.tsx';
import { useEffect } from 'react';

const cookies = new Cookies();

export const useCheckAuthMutation = () => {
  const dispatch = useDispatch();
  const { mutateAsync, isLoading } = useMutation(handleGetCurrentUser, {
    onError: ({ response }: any) => {
      if (response.status === ServerErrors.NO_PERMISSION) {
        clearCookies();
        dispatch(actions.setUser(initialState));

        return;
      }
      handleAlert();
    },
    onSuccess: (data: UserReducerProps) => {
      if (data) {
        handleSetProfile(data?.userData?.profiles);
        dispatch(actions.setUser(data));
      }
    },
    retry: false,
  });
  return { isLoading, mutateAsync };
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
        }),
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
