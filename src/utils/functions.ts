import format from 'date-fns/format';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import api from './api';
import { LOCATION_ERRORS, ToolTypeType } from './constants';
import { routes } from './routes';
import { validationTexts } from './texts';
import { Profile, ProfileId, ResponseProps, ToolsGroup } from './types';
const cookies = new Cookies();

export const clearCookies = () => {
  cookies.remove('token', { path: '/' });
  cookies.remove('refreshToken', { path: '/' });
  cookies.remove('module', { path: '/' });
  cookies.remove('profileId', { path: '/' });
};

export const getErrorMessage = (responseError: string) =>
  validationTexts[responseError as keyof typeof validationTexts] || validationTexts.error;

export const handleErrorToastFromServer = (responseError: string = 'error') => {
  handleErrorToast(getErrorMessage(getReactQueryErrorMessage(responseError)));
};

export const handleErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
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

export const handleUpdateTokens = (data: {
  token?: string;
  error?: string;
  message?: string;
  refreshToken?: string;
}) => {
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
      return onError(getErrorMessage(response?.error));
    }

    if (!response || response?.error) {
      return handleErrorToastFromServer(response.error.type!);
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

export const getToolTypeList = async (input: string, page: number, toolType: ToolTypeType) => {
  return await api.toolTypes({
    filter: { label: input, type: toolType },
    page,
  });
};

export const getLocationList = async (input: string, page: number | string) => {
  return await api.getLocations({
    search: input,
    page,
    query: {
      category: {
        $in: [
          'RIVER',
          'CANAL',
          'INTERMEDIATE_WATER_BODY',
          'TERRITORIAL_WATER_BODY',
          'NATURAL_LAKE',
          'PONDED_LAKE',
          'POND',
          'ISOLATED_WATER_BODY',
        ],
      },
    },
  });
};

function getCentroid(bbox: number[]) {
  const minX = bbox[0];
  const minY = bbox[1];
  const maxX = bbox[2];
  const maxY = bbox[3];

  const centroidX = (minX + maxX) / 2;
  const centroidY = (minY + maxY) / 2;

  return { x: centroidX, y: centroidY };
}

export const getBars = async () => {
  const bars = await api.getBars();
  return bars?.features
    .sort((a: any, b: any) => {
      const numA = parseInt(a.properties.name.match(/\d+/)[0], 10);
      const numB = parseInt(b.properties.name.match(/\d+/)[0], 10);

      if (numA !== numB) {
        return numA - numB;
      } else {
        return a.properties.name.localeCompare(b.properties.name);
      }
    })
    .map((item: any) => {
      const { x, y } = getCentroid(item?.bbox.map((coordinate: string) => Number(coordinate)));
      return {
        x,
        y,
        name: item?.properties?.name,
      };
    });
};

export const getBuiltToolInfo = (toolsGroup: ToolsGroup) => {
  return {
    label: toolsGroup?.tools?.[0]?.toolType?.label,
    sealNr: toolsGroup.tools?.map((tool: any) => tool?.sealNr)?.join(', '),
    isGroup: toolsGroup?.tools?.length > 1,
    locationName: toolsGroup?.buildEvent?.location?.name,
  };
};

export const getReactQueryErrorMessage = (response: any) => response?.data?.message;

export const formatDate = (date?: Date | string) =>
  date ? format(new Date(date), 'yyyy-MM-dd') : '-';

export const isEmpty = (arr: any[]) => !!arr.length;

export const isNew = (id?: string) => !id || id === 'naujas';
