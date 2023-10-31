import { RolesTypes } from './constants.ts';

export type ProfileId = 'personal' | string;
export interface Profile {
  id: ProfileId;
  name: string;
  code?: string;
  email?: string;
  role: RolesTypes;
  phone: string;
}
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: RolesTypes;
  active?: boolean;
  phone?: string;
  mobilePhone?: string;
  password?: string;
  personalCode?: string;
  duties?: string;
  accessDate?: Date;
  getData?: boolean;
  error?: string;
  profiles?: Profile[];
}
export interface Tenant {
  id: number;
}

export interface UpdateTokenProps {
  token?: string;
  error?: string;
  message?: string;
  refreshToken?: string;
}

export interface ResponseProps {
  endpoint: () => Promise<any>;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  onOffline?: () => void;
}

export type FileProps = {
  url: string;
  name: string;
  size: number;
  main?: boolean;
};

export interface ToolType {
  id: number;
  label: string;
}

export interface Tool {
  id: number;
  sealNr: string;
  eyeSize: number;
  eyeSize2: number;
  netLength: number;
  toolType: ToolType['id'];
  toolGroup: ToolGroup['id'];
  tenant: Tenant['id'];
  user: User['id'];
}

export interface ToolGroup {
  id: number;
  tools: any[];
  startDate: Date;
  startFishing: Fishing['id'];
  endDate: Date;
  endFishing: Fishing['id'];
  geom: any;
  locationType: string;
  locationId: number;
  locationName: string;
  tenant: Tenant['id'];
  user: User['id'];
}

export interface Fishing {
  id: number;
  startDate: Date;
  endDate: Date;
  skipDate: Date;
  geom: any;
  type: FishType['id'];
  tenant: Tenant['id'];
  user: User['id'];
}

export interface FishType {
  id: number;
  label: string;
}
