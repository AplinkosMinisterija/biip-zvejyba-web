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
