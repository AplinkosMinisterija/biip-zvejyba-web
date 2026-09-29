import { LocationType } from './constants';
import { formatDate } from './functions';
import { summaryFilterSummaryLabels } from './texts';

export type SummaryZoneOption = { id: LocationType; label: string };
export type SummaryLocation = { id: string; name: string };
export type SummaryLabeledOption = { id: string | number; label: string };

export type SummaryFilterValues = {
  types?: SummaryZoneOption[];
  location?: SummaryLocation | null;
  fishTypes?: SummaryLabeledOption[];
  createdFrom?: string | Date;
  createdTo?: string | Date;
};

export type SummaryFilterOptions = {
  bars: SummaryLocation[];
  polders: SummaryLocation[];
  fishTypes: SummaryLabeledOption[];
};

export type SummaryReportForm = { byMonths: boolean; byToolTypes: boolean };

export type CatchSummaryParams = {
  types?: LocationType[];
  locationId?: string;
  locationName?: string;
  fishTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
  byMonths: boolean;
  byToolTypes: boolean;
};

export type SummaryLocationScope = LocationType.ESTUARY | LocationType.POLDERS;

// Bars and polders are fixed lists worth picking from; inland water bodies come
// from UETK, and a mix of zones has no single list — both take every location.
export const getSummaryLocationScope = (
  types?: SummaryZoneOption[],
): SummaryLocationScope | null => {
  if (types?.length !== 1) return null;

  const [{ id }] = types;
  return id === LocationType.ESTUARY || id === LocationType.POLDERS ? id : null;
};

const ids = (items: SummaryLabeledOption[]) => items.map((item) => String(item.id));

const labels = (items: { label: string }[]) => items.map((item) => item.label).join(', ');

export const mapSummaryParams = (
  filters: SummaryFilterValues,
  report: SummaryReportForm,
): CatchSummaryParams => {
  const params: CatchSummaryParams = { ...report };

  if (filters.types?.length) params.types = filters.types.map((type) => type.id);

  // Polder and bar ids collide, so the API matches on id AND name.
  if (filters.location && getSummaryLocationScope(filters.types)) {
    params.locationId = filters.location.id;
    params.locationName = filters.location.name;
  }

  if (filters.fishTypes?.length) params.fishTypes = ids(filters.fishTypes);
  if (filters.createdFrom) params.dateFrom = formatDate(filters.createdFrom);
  if (filters.createdTo) params.dateTo = formatDate(filters.createdTo);

  return params;
};

const describePeriod = ({ createdFrom, createdTo }: SummaryFilterValues) => {
  if (createdFrom && createdTo) return `${formatDate(createdFrom)} – ${formatDate(createdTo)}`;
  if (createdFrom) return `${summaryFilterSummaryLabels.from} ${formatDate(createdFrom)}`;
  if (createdTo) return `${summaryFilterSummaryLabels.to} ${formatDate(createdTo)}`;
  return null;
};

const describeLocation = (filters: SummaryFilterValues) => {
  const scope = getSummaryLocationScope(filters.types);
  if (!scope || !filters.location) return null;

  const label =
    scope === LocationType.ESTUARY
      ? summaryFilterSummaryLabels.bar
      : summaryFilterSummaryLabels.polder;
  return `${label}: ${filters.location.name}`;
};

export const describeSummaryFilters = (filters: SummaryFilterValues): string[] =>
  [
    filters.types?.length ? `${summaryFilterSummaryLabels.types}: ${labels(filters.types)}` : null,
    describeLocation(filters),
    filters.fishTypes?.length
      ? `${summaryFilterSummaryLabels.fishTypes}: ${labels(filters.fishTypes)}`
      : null,
    describePeriod(filters),
  ].filter((item): item is string => !!item);
