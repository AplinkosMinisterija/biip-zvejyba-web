import { useMutation, useQuery } from 'react-query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { actions, initialState } from '../state/user/reducer';
import api from './api';
import { LOCATION_ERRORS, RoleTypes } from './constants';
import { clearCookies, handleErrorToastFromServer, handleSetProfile } from './functions';

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

      return handleErrorToastFromServer();
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
      handleErrorToastFromServer();
    },
    onSuccess: ({ url }) => {
      window.location.replace(url);
    },
    retry: false,
  });
  return { isLoading, mutateAsync };
};

export const useFishTypes = () => {
  const { data = [], isLoading } = useQuery(['fishTypes'], api.getFishTypes, { retry: false });

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
      handleErrorToastFromServer();
    },
    onSuccess: () => {
      clearCookies();
      dispatch(actions.setUser(initialState));
    },
  });
  return { mutateAsync };
};

export const useGeolocationWatcher = () => {
  const [coordinates, setCoordinates] = useState<any>();
  const [error, setError] = useState<LOCATION_ERRORS>();
  const options = {
    enableHighAccuracy: true,
    timeout: 100000,
  };
  const successHandler = (position: any) => {
    setError(undefined);
    setCoordinates({
      x: position.coords.longitude,
      y: position.coords.latitude,
    });
  };
  const errorHandler = ({ code }: any) => {
    setError(code);
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
  };

  useEffect(() => {
    getCurrentPosition();
    const id = navigator.geolocation.watchPosition(successHandler, errorHandler, options);
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { coordinates, error, getCurrentPosition };
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
