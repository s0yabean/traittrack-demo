import { describe, expect, it } from 'vitest';
import { QUESTIONS, TAGS } from '../src/data/questions';
import { applyImpacts, emptyProfile } from '../src/lib/scoring';
import { nextQuestion, separation, spread, type Question } from '../src/lib/selection';
import { TRAIT_IDS } from '../src/lib/traits';

const q = (id: string, tag: string, options: Question['options']): Question => ({
  id,
  tag,
  text: id,
  options,
});

// A tiny bank where each question is good at telling apart one pair of traits.
const BANK: Question[] = [
  q('weak', 'A', [{ text: 'x', impacts: { Sprinter: 1, Spark: 1, Anchor: 1, Analyst: 1 } }]),
  q('spark-vs-anchor', 'A', [
    { text: 'spark', impacts: { Spark: 10 } },
    { text: 'anchor', impacts: { Anchor: 10 } },
  ]),
  q('sprinter-vs-analyst', 'B', [
    { text: 'sprinter', impacts: { Sprinter: 10 } },
    { text: 'analyst', impacts: { Analyst: 10 } },
  ]),
  q('broad', 'B', [
    { text: 'a', impacts: { Sprinter: 12 } },
    { text: 'b', impacts: { Spark: 12 } },
    { text: 'c', impacts: { Anchor: 12 } },
    { text: 'd', impacts: { Analyst: 12 } },
  ]),
];

describe('separation and spread', () => {
  it('is zero when no option tells the two traits apart', () => {
    expect(separation(BANK[0], 'Spark', 'Anchor')).toBe(0);
    expect(spread(BANK[0])).toBe(0);
  });

  it('is highest for the pair a question was written for', () => {
    const sa = BANK[1];
    expect(separation(sa, 'Spark', 'Anchor')).toBe(10);
    expect(separation(sa, 'Sprinter', 'Analyst')).toBe(0);
  });
});

describe('nextQuestion', () => {
  it('starts with the question that spreads all traits furthest', () => {
    expect(nextQuestion(BANK, emptyProfile())?.id).toBe('broad');
  });

  it('targets the current top two traits once there is evidence', () => {
    const sparkAnchor = applyImpacts(emptyProfile(), { Spark: 10, Anchor: 8 });
    expect(nextQuestion(BANK, sparkAnchor)?.id).toBe('spark-vs-anchor');

    const sprinterAnalyst = applyImpacts(emptyProfile(), { Sprinter: 10, Analyst: 8 });
    expect(nextQuestion(BANK, sprinterAnalyst)?.id).toBe('sprinter-vs-analyst');
  });

  it('never repeats an answered question', () => {
    const p = applyImpacts(emptyProfile(), { Spark: 10, Anchor: 8 });
    const next = nextQuestion(BANK, p, { answered: ['spark-vs-anchor'] });
    expect(next?.id).not.toBe('spark-vs-anchor');
  });

  it('respects the tag filter', () => {
    const p = applyImpacts(emptyProfile(), { Spark: 10, Anchor: 8 });
    expect(nextQuestion(BANK, p, { tag: 'B' })?.tag).toBe('B');
    expect(nextQuestion(BANK, p, { tag: 'missing' })).toBeNull();
  });

  it('returns null once every question is answered', () => {
    expect(nextQuestion(BANK, emptyProfile(), { answered: BANK.map((b) => b.id) })).toBeNull();
  });

  it('walks the real bank without repeats until it runs out', () => {
    let profile = emptyProfile();
    const seen: string[] = [];
    for (;;) {
      const next = nextQuestion(QUESTIONS, profile, { answered: seen });
      if (!next) break;
      expect(seen).not.toContain(next.id);
      seen.push(next.id);
      profile = applyImpacts(profile, next.options[0].impacts);
    }
    expect(seen).toHaveLength(QUESTIONS.length);
  });
});

describe('sample question bank', () => {
  it('has unique ids, at least two options each, and only known traits', () => {
    const ids = QUESTIONS.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of QUESTIONS) {
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      for (const option of question.options) {
        for (const [trait, points] of Object.entries(option.impacts)) {
          expect(TRAIT_IDS).toContain(trait);
          expect(points).toBeGreaterThan(0);
        }
      }
    }
    expect(TAGS.length).toBe(new Set(QUESTIONS.map((x) => x.tag)).size);
  });

  it('can lead to every trait when answered consistently', () => {
    for (const trait of TRAIT_IDS) {
      let profile = emptyProfile();
      for (const question of QUESTIONS) {
        const best = [...question.options].sort(
          (a, b) => (b.impacts[trait] ?? 0) - (a.impacts[trait] ?? 0),
        )[0];
        profile = applyImpacts(profile, best.impacts);
      }
      const top = TRAIT_IDS.reduce((a, b) => (profile.points[b] > profile.points[a] ? b : a));
      expect(top).toBe(trait);
    }
  });
});
