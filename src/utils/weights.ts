export type FishWeightsById = { [fishTypeId: string]: number };

// Weights come from numeric inputs; guard against float artifacts when
// subtracting (e.g. 17.1 - 12.3).
const roundWeight = (value: number) => Math.round(value * 1000) / 1000;

/**
 * Weight already recorded in OTHER tools groups of the current fishing.
 * `all` is the fishing-wide preliminary aggregate (includes this group's
 * own latest entry), `own` is this group's latest entry — so the remainder
 * is what the rest of the boat's catch weighs. Clamped at zero: a stale
 * cache can momentarily make `own` exceed `all`.
 */
export const otherToolsPreliminary = (
  all: FishWeightsById = {},
  own: FishWeightsById = {},
): FishWeightsById => {
  const result: FishWeightsById = {};
  for (const key in all) {
    const rest = roundWeight((Number(all[key]) || 0) - (Number(own[key]) || 0));
    if (rest > 0) {
      result[key] = rest;
    }
  }
  return result;
};

/**
 * Convert scale readings (cumulative boat weight per species) into this
 * tools group's own catch by subtracting what other groups already
 * recorded. Negative deltas are returned as-is — the caller blocks the
 * submit and tells the user which species is off.
 */
export const cumulativeToDeltas = (
  entered: FishWeightsById,
  other: FishWeightsById,
): FishWeightsById => {
  const result: FishWeightsById = {};
  for (const key in entered) {
    result[key] = roundWeight((Number(entered[key]) || 0) - (Number(other[key]) || 0));
  }
  return result;
};
