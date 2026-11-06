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

// Nemuno žemupys / Šventoji is not pickable: its water bodies come from UETK, so
// there is no list to filter by; the API draws that zone's block regardless.
export const SUMMARY_ZONE_TYPES: SummaryLocationScope[] = [
  LocationType.ESTUARY,
  LocationType.POLDERS,
];

// A single zone has a fixed list of locations worth picking from; a mix of zones
// has none, so it takes every location.
export const getSummaryLocationScope = (
  types?: SummaryZoneOption[] | null,
): SummaryLocationScope | null => {
  if (types?.length !== 1) return null;

  const [{ id }] = types;
  return SUMMARY_ZONE_TYPES.find((type) => type === id) ?? null;
};

const isPickableZone = (zone: SummaryZoneOption) =>
  SUMMARY_ZONE_TYPES.some((type) => type === zone.id);

// Only the field the zones actually show holds a location.
const shownLocations = (filters: SummaryFilterValues) => {
  const scope = getSummaryLocationScope(filters.types);
  return {
    bar: scope === LocationType.ESTUARY ? filters.bar ?? null : null,
    polder: scope === LocationType.POLDERS ? filters.polder ?? null : null,
  };
};

// A browser can still hold what an older build saved: a zone no longer offered,
// and the bar or polder picked under it.
export const withPickableZones = (filters: SummaryFilterValues): SummaryFilterValues => {
  const pickable = filters.types
    ? { ...filters, types: filters.types.filter(isPickableZone) }
    : filters;

  return { ...pickable, ...shownLocations(pickable) };
};

const ids = (items: SummaryLabeledOption[]) => items.map((item) => String(item.id));

// Polder and bar ids collide, so the API matches on id AND name.
const pickedLocation = (filters: SummaryFilterValues) => {
  const { bar, polder } = shownLocations(filters);
  return bar ?? polder;
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
