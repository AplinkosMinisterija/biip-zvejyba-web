import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { actions } from '../state/user/reducer';
import api from './api';
import { intersectionObserverConfig, RoleTypes } from './constants';
import {
  clearCookies,
  handleErrorToastFromServer,
  handleSetProfile,
  handleSuccessToast,
} from './functions';

import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import Cookies from 'universal-cookie';
import { RootState } from '../state/store';
import { routes, slugs } from './routes';
import { User } from './types';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

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

      return handleErrorToastFromServer(response);
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
  } = useQuery(['fishingWeights'], api.getFishingWeights, { retry: false });
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
  fn: (params: { page: number }) => any,
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
    queryKey: [queryKey],
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
    (data: any) => api.createFishingFishWeights(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['fishingWeights']);
        handleSuccessToast('Žuvis sėkmingai pasverta krante.');
        navigate(slugs.fishingCurrent);
      },
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );
  return { fishingWeightMutation, fishingWeightLoading };
};
