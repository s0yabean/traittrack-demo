import { describe, expect, it } from 'vitest';
import {
  PRIOR_POINTS,
  applyImpacts,
  confidence,
  emptyProfile,
  rankTraits,
  toPercentages,
} from '../src/lib/scoring';
import { TRAIT_IDS } from '../src/lib/traits';

const sum = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);

describe('emptyProfile', () => {
  it('starts every trait at the prior with no observations', () => {
    const p = emptyProfile();
    expect(p.observations).toBe(0);
    for (const id of TRAIT_IDS) expect(p.points[id]).toBe(PRIOR_POINTS);
    expect(toPercentages(p)).toEqual({ Sprinter: 25, Spark: 25, Anchor: 25, Analyst: 25 });
  });
});

describe('applyImpacts', () => {
  it('adds points without mutating the input', () => {
    const before = emptyProfile();
    const after = applyImpacts(before, { Analyst: 12, Sprinter: 4 });
    expect(before.points.Analyst).toBe(PRIOR_POINTS);
    expect(after.points.Analyst).toBe(PRIOR_POINTS + 12);
    expect(after.points.Sprinter).toBe(PRIOR_POINTS + 4);
    expect(after.observations).toBe(1);
  });

  it('ignores empty, negative and non-finite impacts and does not count them', () => {
    const p = emptyProfile();
    expect(applyImpacts(p, {})).toBe(p);
    expect(applyImpacts(p, { Spark: -5, Anchor: Number.NaN, Analyst: Infinity })).toBe(p);
  });

  it('gives the same result whatever order the answers come in', () => {
    const a = [{ Spark: 10 }, { Analyst: 12, Anchor: 2 }, { Sprinter: 8, Spark: 6 }];
    const forward = a.reduce(applyImpacts, emptyProfile());
    const backward = [...a].reverse().reduce(applyImpacts, emptyProfile());
    expect(forward).toEqual(backward);
  });
});

describe('toPercentages', () => {
  it('always sums to exactly 100', () => {
    let p = emptyProfile();
    for (const impacts of [{ Spark: 7 }, { Analyst: 3 }, { Anchor: 11 }, { Sprinter: 1 }]) {
      p = applyImpacts(p, impacts);
      expect(sum(toPercentages(p))).toBe(100);
    }
  });

  it('rounds thirds to 100 instead of 99', () => {
    const p = { points: { Sprinter: 1, Spark: 1, Anchor: 1, Analyst: 0 }, observations: 1 };
    const pct = toPercentages(p);
    expect(sum(pct)).toBe(100);
    expect(pct).toEqual({ Sprinter: 34, Spark: 33, Anchor: 33, Analyst: 0 });
  });

  it('does not divide by zero', () => {
    const p = { points: { Sprinter: 0, Spark: 0, Anchor: 0, Analyst: 0 }, observations: 0 };
    expect(sum(toPercentages(p))).toBe(100);
  });
});

describe('rankTraits', () => {
  it('orders by points and keeps model order on ties', () => {
    expect(rankTraits(emptyProfile()).map((t) => t.id)).toEqual([...TRAIT_IDS]);
    const p = applyImpacts(emptyProfile(), { Analyst: 20, Anchor: 5 });
    expect(rankTraits(p).map((t) => t.id)).toEqual(['Analyst', 'Anchor', 'Sprinter', 'Spark']);
  });
});

describe('confidence', () => {
  it('is none with no evidence', () => {
    expect(confidence(emptyProfile())).toBe('none');
  });

  it('is low when the top two are close', () => {
    const p = applyImpacts(emptyProfile(), { Spark: 10, Anchor: 9 });
    expect(confidence(p)).toBe('low');
  });

  it('is at most medium after a few answers, even with a clear lead', () => {
    let p = emptyProfile();
    for (let i = 0; i < 4; i++) p = applyImpacts(p, { Analyst: 12 });
    expect(rankTraits(p)[0].id).toBe('Analyst');
    expect(confidence(p)).toBe('medium');
  });

  it('is high with a clear lead and enough answers', () => {
    let p = emptyProfile();
    for (let i = 0; i < 5; i++) p = applyImpacts(p, { Analyst: 12 });
    expect(confidence(p)).toBe('high');
  });
});
