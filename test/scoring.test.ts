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
    expect(toPercentages(p)).toEqual({ Knight: 25, Explorer: 25, Healer: 25, Wizard: 25 });
  });
});

describe('applyImpacts', () => {
  it('adds points without mutating the input', () => {
    const before = emptyProfile();
    const after = applyImpacts(before, { Wizard: 12, Knight: 4 });
    expect(before.points.Wizard).toBe(PRIOR_POINTS);
    expect(after.points.Wizard).toBe(PRIOR_POINTS + 12);
    expect(after.points.Knight).toBe(PRIOR_POINTS + 4);
    expect(after.observations).toBe(1);
  });

  it('ignores empty, negative and non-finite impacts and does not count them', () => {
    const p = emptyProfile();
    expect(applyImpacts(p, {})).toBe(p);
    expect(applyImpacts(p, { Explorer: -5, Healer: Number.NaN, Wizard: Infinity })).toBe(p);
  });

  it('gives the same result whatever order the answers come in', () => {
    const a = [{ Explorer: 10 }, { Wizard: 12, Healer: 2 }, { Knight: 8, Explorer: 6 }];
    const forward = a.reduce(applyImpacts, emptyProfile());
    const backward = [...a].reverse().reduce(applyImpacts, emptyProfile());
    expect(forward).toEqual(backward);
  });
});

describe('toPercentages', () => {
  it('always sums to exactly 100', () => {
    let p = emptyProfile();
    for (const impacts of [{ Explorer: 7 }, { Wizard: 3 }, { Healer: 11 }, { Knight: 1 }]) {
      p = applyImpacts(p, impacts);
      expect(sum(toPercentages(p))).toBe(100);
    }
  });

  it('rounds thirds to 100 instead of 99', () => {
    const p = { points: { Knight: 1, Explorer: 1, Healer: 1, Wizard: 0 }, observations: 1 };
    const pct = toPercentages(p);
    expect(sum(pct)).toBe(100);
    expect(pct).toEqual({ Knight: 34, Explorer: 33, Healer: 33, Wizard: 0 });
  });

  it('does not divide by zero', () => {
    const p = { points: { Knight: 0, Explorer: 0, Healer: 0, Wizard: 0 }, observations: 0 };
    expect(sum(toPercentages(p))).toBe(100);
  });
});

describe('rankTraits', () => {
  it('orders by points and keeps model order on ties', () => {
    expect(rankTraits(emptyProfile()).map((t) => t.id)).toEqual([...TRAIT_IDS]);
    const p = applyImpacts(emptyProfile(), { Wizard: 20, Healer: 5 });
    expect(rankTraits(p).map((t) => t.id)).toEqual(['Wizard', 'Healer', 'Knight', 'Explorer']);
  });
});

describe('confidence', () => {
  it('is none with no evidence', () => {
    expect(confidence(emptyProfile())).toBe('none');
  });

  it('is low when the top two are close', () => {
    const p = applyImpacts(emptyProfile(), { Explorer: 10, Healer: 9 });
    expect(confidence(p)).toBe('low');
  });

  it('is at most medium after a few answers, even with a clear lead', () => {
    let p = emptyProfile();
    for (let i = 0; i < 4; i++) p = applyImpacts(p, { Wizard: 12 });
    expect(rankTraits(p)[0].id).toBe('Wizard');
    expect(confidence(p)).toBe('medium');
  });

  it('is high with a clear lead and enough answers', () => {
    let p = emptyProfile();
    for (let i = 0; i < 5; i++) p = applyImpacts(p, { Wizard: 12 });
    expect(confidence(p)).toBe('high');
  });
});
