import { TRAIT_IDS, type Impacts, type TraitId } from './traits';

/**
 * Running evidence for one client. Raw points per trait, never normalised in place,
 * so the order of answers does not change the result and rounding never drifts.
 */
export interface Profile {
  points: Record<TraitId, number>;
  /** How many observations (answers or notes) have been added. */
  observations: number;
}

/** Points every trait starts with, so one answer cannot swing a fresh profile to 100%. */
export const PRIOR_POINTS = 10;

export type Confidence = 'none' | 'low' | 'medium' | 'high';

export interface RankedTrait {
  id: TraitId;
  points: number;
  percent: number;
}

export function emptyProfile(): Profile {
  const points = {} as Record<TraitId, number>;
  for (const id of TRAIT_IDS) points[id] = PRIOR_POINTS;
  return { points, observations: 0 };
}

/** Returns a new profile with the impacts added. Negative or non-finite impacts are ignored. */
export function applyImpacts(profile: Profile, impacts: Impacts): Profile {
  const points = { ...profile.points };
  let changed = false;
  for (const id of TRAIT_IDS) {
    const value = impacts[id];
    if (value === undefined || !Number.isFinite(value) || value <= 0) continue;
    points[id] += value;
    changed = true;
  }
  if (!changed) return profile;
  return { points, observations: profile.observations + 1 };
}

/**
 * Whole-number percentages that always sum to 100 (largest-remainder rounding).
 * Ties keep TRAIT_IDS order.
 */
export function toPercentages(profile: Profile): Record<TraitId, number> {
  const total = TRAIT_IDS.reduce((sum, id) => sum + profile.points[id], 0);
  const result = {} as Record<TraitId, number>;
  if (total <= 0) {
    TRAIT_IDS.forEach((id, i) => (result[id] = i === 0 ? 100 : 0));
    return result;
  }
  const exact = TRAIT_IDS.map((id) => ({ id, value: (profile.points[id] / total) * 100 }));
  let assigned = 0;
  for (const { id, value } of exact) {
    result[id] = Math.floor(value);
    assigned += result[id];
  }
  const byRemainder = [...exact].sort(
    (a, b) => b.value - Math.floor(b.value) - (a.value - Math.floor(a.value)),
  );
  for (let i = 0; i < 100 - assigned; i++) result[byRemainder[i].id] += 1;
  return result;
}

/** Traits from most to least likely. Ties keep TRAIT_IDS order. Does not mutate. */
export function rankTraits(profile: Profile): RankedTrait[] {
  const percent = toPercentages(profile);
  return TRAIT_IDS.map((id) => ({ id, points: profile.points[id], percent: percent[id] })).sort(
    (a, b) => b.points - a.points,
  );
}

/**
 * How far to trust the top trait. A close call between the top two is never more
 * than "low", and a handful of observations is never "high".
 */
export function confidence(profile: Profile): Confidence {
  if (profile.observations === 0) return 'none';
  const [first, second] = rankTraits(profile);
  const margin = first.percent - second.percent;
  if (margin < 8) return 'low';
  if (margin >= 15 && profile.observations >= 5) return 'high';
  return 'medium';
}
