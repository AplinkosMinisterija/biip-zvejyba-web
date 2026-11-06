# summary — area note

The investigator-only catch summary screen (`/suvestine`): filters + a report
form, which download an Excel the API builds.

## Files that matter
- `src/pages/Summary.tsx` — the screen: one `DynamicFilter` config entry per
  filter, the two report-form switches, the download mutation.
- `src/utils/summary.ts` — the pure layer: pickable zones, pruning of saved
  filters, filters → API query params.
- `src/utils/options.ts › getSummaryZoneOptions` — the zone options, labels
  joined onto `SUMMARY_ZONE_TYPES`.
- `src/utils/texts.ts › summaryFilters / summaryZoneLabels / summaryTexts` —
  every Lithuanian label on the screen.
- `src/utils/hooks.ts › useSummaryFilterOptions` — bars
  (`/locations/fishing_sections`), polders, fish types, tool types.

## Invariants
- `summary.ts › SUMMARY_ZONE_TYPES` is the only list of pickable zones:
  ESTUARY + POLDERS. INLAND_WATERS is deliberately absent — its water bodies
  come from UETK, so there is no list to filter by — yet the API still draws
  its Excel block, keeping that catch in „IŠ VISO“.
- The bar / polder field shows only while exactly one zone is picked
  (`summary.ts › getSummaryLocationScope`), and only the shown field's value
  reaches the API (`summary.ts › shownLocations`, used by both
  `withPickableZones` and `mapSummaryParams`).
- Filters are persisted raw under localStorage `catch_summary_filters`
  (design-system `useStorage`), so the screen must tolerate anything an older
  build saved → `summary.ts › withPickableZones` prunes on read. Pinned by
  `src/utils/summary.spec.ts` and `tests/e2e/catch-summary-filters.spec.ts`.
- Polder and bar ids collide, so the API gets `locationId` AND `locationName`.

## Contract
`GET /researches/catchSummary` — `types[]` (`LocationType`), `locationId` +
`locationName`, `fishTypes[]`, `toolTypes[]`, `dateFrom` / `dateTo`
(`YYYY-MM-DD`), `byMonths`, `byToolTypes`. Answers an xlsx stream; gated on the
INVESTIGATOR role.

## Traps
- A chip stays visible for a value whose field is hidden: `DynamicFilter`
  renders the applied-filter row from the `filters` prop, not from what the form
  shows. Pruning therefore has to happen before that prop, not inside the
  download handler (2026-11-06: pruning only `types` left a
  „Žvejybos barai: 12“ chip on screen; the e2e caught it, no unit test could).
- The e2e spec keeps its own copy of the labels — rename in `texts.ts` and the
  spec starts targeting nothing.
- `useStorage(key, initial, true)` writes raw JSON under the key verbatim; the
  e2e seeds it with `page.addInitScript`.

_Updated 2026-11-06._
