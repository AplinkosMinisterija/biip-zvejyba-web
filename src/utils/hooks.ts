import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { actions } from '../state/user/reducer';
import api from './api';
import { intersectionObserverConfig, RoleTypes } from './constants';
import {
  clearCookies,
  handleErrorToast,
  handleErrorToastFromServer,
  handleGeolocationToast,
  handleSetProfile,
  handleSuccessToast,
} from './functions';

import { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AppDispatch, RootState } from '../state/store';
import { routes, slugs } from './routes';
import { User } from './types';

const cookies = new Cookies();

type Coordinates = {
  x: number;
  y: number;
};

type UseGeolocationResult = {
  coordinates: Coordinates | null;
  loading: boolean;
  refresh: () => void;
};

const INITIAL_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 30000,
};

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 25000,
};

export const emptyUser = {
  userData: {},
  loggedIn: false,
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCheckUserInfo = () => {
  const dispatch = useAppDispatch();
  const token = cookies.get('token');

  const { isLoading } = useQuery([token], () => api.userInfo(), {
    onError: ({ response }: any) => {
      if (response.status === 401) {
        clearCookies();
        dispatch(actions.setUser(emptyUser));

        return;
      }
      return handleErrorToastFromServer();
    },
    onSuccess: async (data: User) => {
      if (data) {
        handleSetProfile(data?.profiles);
        dispatch(actions.setUser({ userData: data, loggedIn: true }));
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
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
  const { data = [], isLoading: fishTypesLoading } = useQuery(['fishTypes'], api.getFishTypes, {
    retry: false,
  });
  return { fishTypes: data, fishTypesLoading };
};

export const useFishWeights = () => {
  const {
    data: fishingWeights = { preliminary: {}, total: {} },
    isLoading: fishingWeightsLoading,
  } = useQuery(['fishingWeights'], () => api.getFishingWeights(), { retry: false });
  return { fishingWeights, fishingWeightsLoading };
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
      dispatch(actions.setUser(emptyUser));
    },
  });
  return { mutateAsync };
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

export const useInfinityLoad = (
  queryKey: string,
  fn: (params: { page: number; [key: string]: any }) => any,
  observerRef: any,
  filters = {},
) => {
  const queryFn = async (page: number) => {
    const data = await fn({
      ...filters,
      page,
    });
    return {
      ...data,
      data: data.rows,
    };
  };

  const result = useInfiniteQuery({
    queryKey: [queryKey, filters],
    queryFn: ({ pageParam }: any) => queryFn(pageParam),
    getNextPageParam: (lastPage: any) => {
      return lastPage?.page < lastPage?.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = result;
  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data, observerRef]);

  return result;
};

export const useCurrentFishing = () => {
  return useQuery(['currentFishing'], () => api.getCurrentFishing(), {
    retry: false,
  });
};

export const useFishingWeightMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: fishingWeightMutation, isLoading: fishingWeightLoading } = useMutation(
    async (data: any) => {
      const res = await api.createFishingFishWeights(data);

      if (!res.success) {
        return handleErrorToastFromServer();
      }

      return res;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['fishingWeights']);

        if (variables.isAutoSave) {
          handleSuccessToast('Žuvų svoriai automatiškai išsaugoti.');
        } else {
          handleSuccessToast('Žuvis sėkmingai pasverta krante.');
          navigate(slugs.fishingCurrent);
        }
      },
    },
  );

  return { fishingWeightMutation, fishingWeightLoading };
};

export const useGeolocation = (): UseGeolocationResult => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  const watchIdRef = useRef<number | null>(null);
  const resolvedInitialRef = useRef(false);
  const loadingToastShownRef = useRef(false);

  const applyPosition = (position: GeolocationPosition) => {
    setCoordinates({
      x: position.coords.longitude,
      y: position.coords.latitude,
    });

    if (!resolvedInitialRef.current) {
      resolvedInitialRef.current = true;
      setLoading(false);
      loadingToastShownRef.current = false;
    }
  };

  const applyError = (err: GeolocationPositionError) => {
    const error = err.code;

    if (error === 1) {
      handleErrorToast('Nesuteikti vietos nustatymo leidimai. Patikrinkite naršyklės nustatymus.');
    } else if (error === 2) {
      handleErrorToast('Nepavyko nustatyti jūsų vietos.');
    } else if (error === 3) {
      handleErrorToast('Baigėsi vietos nustatymo laukimo laikas. Bandykite dar kartą.');
    }

    if (!resolvedInitialRef.current) {
      resolvedInitialRef.current = true;
      setLoading(false);
      loadingToastShownRef.current = false;
    }
  };

  const requestCurrentPosition = () => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    setLoading(true);
    resolvedInitialRef.current = false;

    if (!loadingToastShownRef.current) {
      loadingToastShownRef.current = true;
      handleGeolocationToast(true);
    }

    navigator.geolocation.getCurrentPosition(applyPosition, applyError, INITIAL_OPTIONS);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    requestCurrentPosition();

    watchIdRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      () => {},
      WATCH_OPTIONS,
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    coordinates,
    loading,
    refresh: requestCurrentPosition,
  };
};
