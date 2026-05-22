import { endOfDay, format, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import api from './api';
import { ToolTypeType } from './constants';
import { validationTexts } from './texts';
import {
  FishingWeights,
  Profile,
  ProfileId,
  ReactQueryError,
  ResponseProps,
  ToolsGroup,
} from './types';
const cookies = new Cookies();

interface UpdateTokenProps {
  token?: string;
  error?: string;
  message?: string;
  refreshToken?: string;
}

export interface BuiltToolsGuards {
  toolTypesCounts: Record<string, number>;
  checkedToolTypesCounts: Record<string, number>;
  withFishToolTypesCounts: Record<string, number>;
  notCompletedToolType?: string;
  blockReturnToolTypes: Set<string>;
}

export interface FishingActionGuards {
  fishingComplete: boolean;
  shoreWeighingDisabled: boolean;
  finishDisabled: boolean;
}

export const clearCookies = () => {
  cookies.remove('token', { path: '/' });
  cookies.remove('refreshToken', { path: '/' });
  cookies.remove('module', { path: '/' });
  cookies.remove('profileId', { path: '/' });
};

export const getErrorMessage = (errorMessage: string) =>
  validationTexts[errorMessage as keyof typeof validationTexts] || validationTexts.error;

export const handleErrorToastFromServer = (responseError?: ReactQueryError) => {
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

export const handleInfoToast = (message: string) => {
  toast.info(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const handleGeolocationToast = (loading: boolean) => {
  if (loading) {
    toast.info(validationTexts.stillLocatingPleaseWait, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
    return;
  }
};

// Shared shape for "I need coordinates to do X" handlers across the app.
// The previous version stacked two toasts when a user clicked an action
// after the safety-net settle timeout fired with no GPS fix — the refresh
// re-triggered the Provider's "Dar nustatoma..." toast and the handler
// dropped a second "Privalote leisti..." error toast on top of it
// (https://github.com/AplinkosMinisterija/biip-zvejyba-web/pull/151).
//
// Trust the Provider to own the toast surface:
// - `loading=true` → its "Dar nustatoma..." toast is already up; do nothing.
// - settled with no coords → kick a refresh. The Provider shows the right
//   toast based on internal state (permission-denied error, or another
//   "Dar nustatoma..." while it tries again).
//
// Returns the coordinates so callers keep TS narrowing, or `null`.
export const requireCoordinates = (state: {
  coordinates: { x: number; y: number } | null;
  loading: boolean;
  refresh: () => void;
}): { x: number; y: number } | null => {
  if (state.coordinates) return state.coordinates;
  if (!state.loading) state.refresh();
  return null;
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
  const { token, refreshToken } = data;

  if (token) {
    cookies.set('token', `${token}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    });
  }

  if (refreshToken) {
    cookies.set('refreshToken', `${refreshToken}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
    });
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
    netLength: toolsGroup.tools.reduce((sum, { data }) => sum + (data?.netLength ?? 0), 0),
  };
};

// Pre-computes the per-tool-type aggregates the tool-list pages need:
// total / checked / with-fish counts, the type that's mid-checking, and the
// types where returning the last unchecked tool would silently lose the
// catch. Mirrors the BE `assertSiblingsHaveFishLogged` guard so the UI can
// hide the "Sugrąžinti į sandėlį" button before the server errors out.
export const computeBuiltToolsGuards = (builtTools: any[]): BuiltToolsGuards => {
  const acc = {
    toolTypesCounts: {} as Record<string, number>,
    checkedToolTypesCounts: {} as Record<string, number>,
    withFishToolTypesCounts: {} as Record<string, number>,
  };

  for (const tool of builtTools ?? []) {
    const id = tool?.tools?.[0]?.toolType?.id;
    if (id == null) continue;
    const key = String(id);
    acc.toolTypesCounts[key] = (acc.toolTypesCounts[key] ?? 0) + 1;
    if (tool.weightEvent) {
      acc.checkedToolTypesCounts[key] = (acc.checkedToolTypesCounts[key] ?? 0) + 1;
      const data = tool.weightEvent.data;
      if (data && Object.keys(data).length > 0) {
        acc.withFishToolTypesCounts[key] = (acc.withFishToolTypesCounts[key] ?? 0) + 1;
      }
    }
  }

  const hasAnyChecked = Object.keys(acc.checkedToolTypesCounts).length > 0;

  const notCompletedToolType = hasAnyChecked
    ? Object.keys(acc.toolTypesCounts).find(
        (key) =>
          (acc.checkedToolTypesCounts[key] ?? 0) > 0 &&
          acc.checkedToolTypesCounts[key] < acc.toolTypesCounts[key],
      )
    : undefined;

  const blockReturnToolTypes = new Set<string>();
  for (const key of Object.keys(acc.toolTypesCounts)) {
    const total = acc.toolTypesCounts[key];
    const checked = acc.checkedToolTypesCounts[key] ?? 0;
    const withFish = acc.withFishToolTypesCounts[key] ?? 0;
    if (total - checked === 1 && checked > 0 && withFish === 0) {
      blockReturnToolTypes.add(key);
    }
  }

  return { ...acc, notCompletedToolType, blockReturnToolTypes };
};

// Resolves the three `LargeButton` enable/disable states on the fishing
// actions screen off a single `fishings/weights` payload. Centralised so
// the rules (and their relationship to the BE guards they mirror) live
// in one place — see the matching `assertEveryToolTypeHasFishLogged`
// and shore-weigh logic in biip-zvejyba-api `fishings.service.ts`.
export const computeFishingActionGuards = (
  fishingWeights?: FishingWeights,
): FishingActionGuards => {
  const hasFish = (record?: Record<string, unknown>) =>
    !!record && Object.values(record).some((amount) => Number(amount) > 0);

  const hasPreliminaryFish = hasFish(fishingWeights?.preliminary);
  const hasShoreWeighedFish = hasFish(fishingWeights?.total);
  const hasUncompletedTools = !!fishingWeights?.hasUncompletedTools;

  // Shore weighing is the terminal catch step; once it's done the
  // fishing is effectively closed and only Baigti is left.
  const fishingComplete = hasShoreWeighedFish;

  return {
    fishingComplete,
    // Shore weighing requires a preliminary catch and is locked once
    // it's been performed.
    shoreWeighingDisabled: fishingComplete || !hasPreliminaryFish,
    // Two server-enforced rules block Baigti:
    // - preliminary catch must be shore-weighed
    // - no (tool type, location) bucket left in Patikrinta-without-fish state
    finishDisabled:
      (hasPreliminaryFish && !hasShoreWeighedFish) || hasUncompletedTools,
  };
};

export const getReactQueryErrorMessage = (response?: ReactQueryError) =>
  response?.data?.type || response?.data?.message || 'error';

export const formatDate = (date?: Date | string) =>
  date ? format(new Date(date), 'yyyy-MM-dd') : '-';

export const isNew = (id?: string) => !id || id === 'naujas';

export const handleGetCaughtFishExcel = async (query: any) => {
  const data = await api.exportLoots({ query });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Sugautos žuvys.xlsx`);
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

export const formatDateTo = (date: Date) => {
  return toZonedTime(endOfDay(new Date(date)), 'Europe/Vilnius');
};

export const formatDateFrom = (date: Date) => {
  return toZonedTime(startOfDay(new Date(date)), 'Europe/Vilnius');
};
