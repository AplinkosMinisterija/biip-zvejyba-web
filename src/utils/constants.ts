export enum ServerErrors {
  USER_NOT_FOUND = `Email not found.`,
  WRONG_PASSWORD = 'Wrong password.',
  NOT_FOUND = 'NOT_FOUND',
  AUTH_USER_EXISTS = 'AUTH_USER_EXISTS',
  NO_PERMISSION = 'NO_PERMISSION',
  TOO_MANY_TOOLS = 'To many tool types',
  NO_TOOLS_IN_STORAGE = 'No tools in storage',
  TOOL_WITH_THIS_SEAL_NUMBER_ALREADY_EXISTS = 'Tool with this seal number already exists',
  FISH_MUST_BE_WEIGHTED = 'Fish must be weighted',
  FISH_ALREADY_WEIGHTED = 'Fish already weighted',
  LOCATION_NOT_FOUND = 'Location not found',
}

export enum RoleTypes {
  USER = 'USER',
  USER_ADMIN = 'USER_ADMIN',
  OWNER = 'OWNER',
}

export enum SickReasons {
  BAD_WEATHER = 'BAD_WEATHER',
  SICK = 'SICK',
  OTHER = 'OTHER',
}

export enum LOCATION_ERRORS {
  NO_ERROR = 0,
  POINT_NOT_FOUND = 1,
  WATER_BODY_NOT_FOUND = 2,
  API_ERROR = 3,
  GEOLOCATION_NOT_SUPPORTE = 4,
  PERMISSION_REQUIRED = 5,
  OTHER = 6,
  POSITION_UNAVAILABLE = 2,
}

export enum LocationType {
  ESTUARY = 'ESTUARY',
  POLDERS = 'POLDERS',
  INLAND_WATERS = 'INLAND_WATERS',
}
export enum ToolTypeType {
  NET = 'NET',
  CATCHER = 'CATCHER',
}

export enum FishingToolsType {
  GROUP = 'GROUP',
  SINGLE = 'SINGLE',
}

export enum FishingWeighType {
  CAUGHT = 'CAUGHT',
  All = 'All',
}

export const intersectionObserverConfig = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};

export enum EventTypes {
  START = 'START',
  END = 'END',
  SKIP = 'SKIP',
  BUILD_TOOLS = 'BUILD_TOOLS',
  REMOVE_TOOLS = 'REMOVE_TOOLS',
  WEIGHT_ON_SHORE = 'WEIGHT_ON_SHORE',
  WEIGHT_ON_BOAT = 'WEIGHT_ON_BOAT',
}

export enum FishingEventType {
  START = 'START',
  END = 'END',
  SKIP = 'SKIP',
}

export enum PopupContentType {
  CONFIRM = 'CONFIRM',
  LOCATION_PERMISSION = 'location_permission',
  START_FISHING = 'start_fishing',
  START_FISHING_INLAND_WATERS = 'start_fishing_inland_water',
  SKIP_FISHING = 'skip_fishing',
  END_FISHING = 'end_fishing',
  CAUGHT_FISH_WEIGHT = 'CAUGHT_FISH_WEIGHT',
  TOOL_GROUP_ACTION = 'TOOL_GROUP_ACTION',
}

export enum FishingTypeRoute {
  ESTUARY = 'marios',
  POLDERS = 'polderiai',
  INLAND_WATERS = 'vidaus_vandenys',
}
