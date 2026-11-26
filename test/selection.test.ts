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
  q('weak', 'A', [{ text: 'x', impacts: { Knight: 1, Explorer: 1, Healer: 1, Wizard: 1 } }]),
  q('explorer-vs-healer', 'A', [
    { text: 'explorer', impacts: { Explorer: 10 } },
    { text: 'healer', impacts: { Healer: 10 } },
  ]),
  q('knight-vs-wizard', 'B', [
    { text: 'knight', impacts: { Knight: 10 } },
    { text: 'wizard', impacts: { Wizard: 10 } },
  ]),
  q('broad', 'B', [
    { text: 'a', impacts: { Knight: 12 } },
    { text: 'b', impacts: { Explorer: 12 } },
    { text: 'c', impacts: { Healer: 12 } },
    { text: 'd', impacts: { Wizard: 12 } },
  ]),
];

describe('separation and spread', () => {
  it('is zero when no option tells the two traits apart', () => {
    expect(separation(BANK[0], 'Explorer', 'Healer')).toBe(0);
    expect(spread(BANK[0])).toBe(0);
  });

  it('is highest for the pair a question was written for', () => {
    const sa = BANK[1];
    expect(separation(sa, 'Explorer', 'Healer')).toBe(10);
    expect(separation(sa, 'Knight', 'Wizard')).toBe(0);
  });
});

describe('nextQuestion', () => {
  it('starts with the question that spreads all traits furthest', () => {
    expect(nextQuestion(BANK, emptyProfile())?.id).toBe('broad');
  });

  it('targets the current top two traits once there is evidence', () => {
    const explorerHealer = applyImpacts(emptyProfile(), { Explorer: 10, Healer: 8 });
    expect(nextQuestion(BANK, explorerHealer)?.id).toBe('explorer-vs-healer');

    const knightWizard = applyImpacts(emptyProfile(), { Knight: 10, Wizard: 8 });
    expect(nextQuestion(BANK, knightWizard)?.id).toBe('knight-vs-wizard');
  });

  it('never repeats an answered question', () => {
    const p = applyImpacts(emptyProfile(), { Explorer: 10, Healer: 8 });
    const next = nextQuestion(BANK, p, { answered: ['explorer-vs-healer'] });
    expect(next?.id).not.toBe('explorer-vs-healer');
  });

  it('respects the tag filter', () => {
    const p = applyImpacts(emptyProfile(), { Explorer: 10, Healer: 8 });
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
