import { LocationType } from './constants';
import { formatDate } from './functions';

export type SummaryZoneOption = { id: LocationType; label: string };
export type SummaryLocation = { id: string; name: string };
export type SummaryLabeledOption = { id: string | number; label: string };

// DynamicFilter clears an unset field to null.
export type SummaryFilterValues = {
  types?: SummaryZoneOption[] | null;
  bar?: SummaryLocation | null;
  polder?: SummaryLocation | null;
  fishTypes?: SummaryLabeledOption[] | null;
  toolTypes?: SummaryLabeledOption[] | null;
  createdFrom?: string | Date | null;
  createdTo?: string | Date | null;
};

export type SummaryFilterOptions = {
  bars: SummaryLocation[];
  polders: SummaryLocation[];
  fishTypes: SummaryLabeledOption[];
  toolTypes: SummaryLabeledOption[];
};

export type SummaryReportForm = { byMonths: boolean; byToolTypes: boolean };

export type CatchSummaryParams = {
  types?: LocationType[];
  locationId?: string;
  locationName?: string;
  fishTypes?: string[];
  toolTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
  byMonths: boolean;
  byToolTypes: boolean;
};

export type SummaryLocationScope = LocationType.ESTUARY | LocationType.POLDERS;

// Bars and polders are fixed lists worth picking from; inland water bodies come
// from UETK, and a mix of zones has no single list — both take every location.
export const getSummaryLocationScope = (
  types?: SummaryZoneOption[] | null,
): SummaryLocationScope | null => {
  if (types?.length !== 1) return null;

  const [{ id }] = types;
  return id === LocationType.ESTUARY || id === LocationType.POLDERS ? id : null;
};

const ids = (items: SummaryLabeledOption[]) => items.map((item) => String(item.id));

// Polder and bar ids collide, so the API matches on id AND name.
const pickedLocation = (filters: SummaryFilterValues) => {
  const scope = getSummaryLocationScope(filters.types);
  if (scope === LocationType.ESTUARY) return filters.bar;
  if (scope === LocationType.POLDERS) return filters.polder;
  return null;
};

export const mapSummaryParams = (
  filters: SummaryFilterValues,
  report: SummaryReportForm,
): CatchSummaryParams => {
  const params: CatchSummaryParams = { ...report };
  const location = pickedLocation(filters);

  if (filters.types?.length) params.types = filters.types.map((type) => type.id);

  if (location) {
    params.locationId = location.id;
    params.locationName = location.name;
  }

  if (filters.fishTypes?.length) params.fishTypes = ids(filters.fishTypes);
  if (filters.toolTypes?.length) params.toolTypes = ids(filters.toolTypes);
  if (filters.createdFrom) params.dateFrom = formatDate(filters.createdFrom);
  if (filters.createdTo) params.dateTo = formatDate(filters.createdTo);

  return params;
};
