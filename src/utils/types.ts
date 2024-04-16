import { FeatureCollection } from '../components/other/DrawMap';
import { EventTypes, FishingEventType, LocationType, RoleTypes, ToolTypeType } from './constants';

export type ProfileId = 'personal' | string;

export interface ResponseProps {
  endpoint: () => Promise<any>;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  onOffline?: () => void;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  cadastralId?: string;
  area: number;
  municipality: string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface DeleteInfoProps {
  deleteButtonText?: string;
  deleteDescriptionFirstPart?: string;
  deleteDescriptionSecondPart?: string;
  deleteTitle?: string;
  deleteName?: string;
  handleDelete?: (props?: any) => void;
}

//Data model

export interface Profile {
  id: ProfileId;
  name: string;
  code?: string;
  email?: string;
  role: RoleTypes;
  isInvestigator: boolean;
  phone: string;
}

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: RoleTypes;
  phone?: string;
  error?: string;
  profiles?: Profile[];
  freelancer: boolean;
}

export interface TenantUser {
  id?: string;
  user?: User;
  role: RoleTypes;
}

export interface Tenant {
  id: number;
}
export interface ToolType {
  id: number;
  label: string;
  type: ToolTypeType;
}

export interface ToolsGroup {
  id: number;
  type: string;
  buildEvent: ToolsGroupEvent;
  removeEvent: ToolsGroupEvent;
  weightEvent?: WeightEvent;
  tools: Tool[];
}

export interface ToolsGroupEvent {
  id: string;
  geom: any;
  location: Location;
  user: User;
  tenant: Tenant;
}

export interface WeightEvent {
  id: string;
  geom: any;
  location: Location;
  data: { [key: string | number]: string | number };
  user: User;
  tenant: Tenant;
}

export interface Tool {
  id: number;
  sealNr: string;
  data: {
    eyeSize: number;
    eyeSize2: number;
    eyeSize3: number;
    netLength: number;
  };
  toolType: ToolType;
  toolsGroup?: ToolsGroup;
  tenant: Tenant;
  user: User;
}

export interface Fishing {
  id: number;
  type: LocationType;
  startEvent: FishingEvent;
  endEvent: FishingEvent;
  skipEvent: FishingEvent;
  tenant: Tenant;
  user: User;
}

export interface FishingEvent {
  id: number;
  geom: any;
  type: FishingEventType;
  tenant: Tenant;
  user: User;
}

export interface FishType {
  id: number;
  label: string;
  photo: any;
}

export interface Research {
  id?: number;
  cadastralId?: string;
  waterBodyData?: { name: string; municipality?: string; area: string };
  startAt?: Date;
  endAt?: Date;
  geom?: FeatureCollection;
  predatoryFishesRelativeAbundance?: string;
  predatoryFishesRelativeBiomass?: string;
  averageWeight?: string;
  valuableFishesRelativeBiomass?: string;
  conditionIndex?: string;
  files?: Array<{
    url: string;
    name: string;
  }>;
  previousResearchData?: {
    year: string;
    conditionIndex: string;
    totalAbundance: string;
    totalBiomass: string;
  };
  fishes?: ResearchFish[];
  totalFishesAbundance?: number;
  totalBiomass?: number;
  tenant?: Tenant;
  user?: User;
  previous?: Research;
}

export interface ResearchFish {
  fishType?: FishType;
  abundance: string;
  biomass: string;
  abundancePercentage: string;
  biomassPercentage: string;
}

//Requests & responses
export interface ToolFormRequest {
  toolType?: ToolType;
  sealNr?: string;
  data: {
    eyeSize?: string;
    eyeSize2?: string;
    eyeSize3?: string;
    netLength?: string;
  };
}
export interface FishingHistoryResponse {
  id: number;
  type: LocationType;
  tenant: Tenant['id'];
  user: User;
  history: {
    id: number;
    type: EventTypes;
    date: string;
    geom: any;
    data?: any;
  }[];
}

export interface GenericObject {
  [key: string]: any;
}
