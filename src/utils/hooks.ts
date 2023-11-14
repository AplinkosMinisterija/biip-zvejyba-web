import { useMutation, useQuery } from 'react-query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { actions as fishingActions } from '../state/fishing/reducer';
import { actions, initialState } from '../state/user/reducer';
import api from './api';
import { LOCATION_ERRORS, RoleTypes } from './constants';
import { clearCookies, handleAlert, handleSetProfile } from './functions';

import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import Cookies from 'universal-cookie';
import { AppDispatch, RootState } from '../state/store';
import { routes } from './routes';
import { User } from './types';

const cookies = new Cookies();

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCheckAuthMutation = () => {
  const dispatch = useDispatch();
  const token = cookies.get('token');

  const { isLoading } = useQuery([token], () => api.userInfo(), {
    onError: ({ response }: any) => {
      if (response.status === 401) {
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

export const useFishTypes = () => {
  const { data = [], isLoading } = useQuery(['fishTypes'], api.getFishTypes);

  return { fishTypes: data, isLoading };
};

export const useGetCurrentProfile = () => {
  const profiles = useAppSelector((state) => state.user.userData.profiles);
  const profileId = cookies.get('profileId');
  const currentProfile = profiles?.find((profile) => profile.id == profileId);
  return currentProfile;
};
export const useFilteredRoutes = () => {
  const profile = useGetCurrentProfile();
  return routes.filter((route: any) => {
    if (!route?.slug) return false;

    if (route.tenantOwner) {
      return [RoleTypes.USER_ADMIN, RoleTypes.OWNER].some((r) => r === profile?.role);
    }

    if (route.isInvestigator) {
      return !!profile?.isInvestigator;
    }

    return true;
  });
};

export const useMenuRouters = () => {
  return useFilteredRoutes().filter((route) => !!route.iconName);
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

export const useGetCurrentRoute = () => {
  const currentLocation = useLocation();

  return routes?.find(
    (route: any) => !!matchPath({ path: route.slug, end: true }, currentLocation.pathname),
  );
};
