export enum Resources {
  FISHINGS = 'fishings',
  USERS = 'users',
  USER_INVITE = 'tenantUsers/invite',
  ME = 'users/me',
  TOOLS = 'tools',
  TENANT_USERS = 'tenantUsers',
}

export enum Populations {
  USER = 'user',
}

export enum ServerErrors {
  USER_NOT_FOUND = `Email not found.`,
  WRONG_PASSWORD = 'Wrong password.',
  NOT_FOUND = 'NOT_FOUND',
  NO_PERMISSION = 'NO_PERMISSION',
}

export enum RoleTypes {
  USER = 'USER',
  USER_ADMIN = 'USER_ADMIN',
  OWNER = 'OWNER',
}

export enum LOCATION_ERRORS {
  NO_ERROR = 0,
  POINT_NOT_FOUND = 1,
  WATER_BODY_NOT_FOUND = 2,
  API_ERROR = 3,
  GEOLOCATION_NOT_SUPPORTE = 4,
  PERMISSION_REQUIRED = 5,
  OTHER = 6,
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

export const intersectionObserverConfig = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};
