import { describe, expect, it } from 'vitest';
import { LocationType } from './constants';
import { getSummaryLocationScope, mapSummaryParams, SummaryFilterValues } from './summary';

const ESTUARY = { id: LocationType.ESTUARY, label: 'Kuršių marios' };
const POLDERS = { id: LocationType.POLDERS, label: 'Polderiai' };
const INLAND = { id: LocationType.INLAND_WATERS, label: 'Nemuno žemupys, Šventoji' };
const BAR = { id: '12', name: '12' };

const report = { byMonths: true, byToolTypes: false };

describe('getSummaryLocationScope', () => {
  it('offers bars for the lagoon alone and polders for polders alone', () => {
    expect(getSummaryLocationScope([ESTUARY])).toBe(LocationType.ESTUARY);
    expect(getSummaryLocationScope([POLDERS])).toBe(LocationType.POLDERS);
  });

  it('hides the field for no zone, inland waters, or a mix of zones', () => {
    expect(getSummaryLocationScope(undefined)).toBeNull();
    expect(getSummaryLocationScope([])).toBeNull();
    expect(getSummaryLocationScope([INLAND])).toBeNull();
    expect(getSummaryLocationScope([ESTUARY, POLDERS])).toBeNull();
  });
});

describe('mapSummaryParams', () => {
  it('sends every filter plus the report form', () => {
    const filters: SummaryFilterValues = {
      types: [ESTUARY],
      bar: BAR,
      fishTypes: [{ id: 1, label: 'Karšis' }],
      toolTypes: [{ id: 3, label: 'Statomieji tinklaičiai 45-50 mm' }],
      createdFrom: new Date(2025, 0, 1),
      createdTo: new Date(2025, 4, 31),
    };

    expect(mapSummaryParams(filters, report)).toEqual({
      types: [LocationType.ESTUARY],
      locationId: '12',
      locationName: '12',
      fishTypes: ['1'],
      toolTypes: ['3'],
      dateFrom: '2025-01-01',
      dateTo: '2025-05-31',
      byMonths: true,
      byToolTypes: false,
    });
  });

  it('sends the polder when polders alone are picked', () => {
    const params = mapSummaryParams(
      { types: [POLDERS], bar: BAR, polder: { id: '1', name: 'Polderis A' } },
      report,
    );

    expect([params.locationId, params.locationName]).toEqual(['1', 'Polderis A']);
  });

  it('drops a bar left over from a zone that no longer shows the field', () => {
    const params = mapSummaryParams({ types: [ESTUARY, POLDERS], bar: BAR }, report);

    expect(params.locationId).toBeUndefined();
    expect(params.types).toEqual([LocationType.ESTUARY, LocationType.POLDERS]);
  });

  it('sends only the report form when nothing is filtered', () => {
    expect(mapSummaryParams({}, report)).toEqual(report);
  });
});
