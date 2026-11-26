import { describe, expect, it } from 'vitest';
import { POINTS_PER_KEYWORD, analyzeObservation, tokenize } from '../src/lib/observation';

describe('analyzeObservation', () => {
  it('scores whole-word keyword matches per trait', () => {
    expect(analyzeObservation('Very direct, asked for the numbers and the data')).toEqual({
      Sprinter: POINTS_PER_KEYWORD,
      Analyst: 2 * POINTS_PER_KEYWORD,
    });
  });

  it('is case-insensitive', () => {
    expect(analyzeObservation('WARM and asked about my TEAM')).toEqual({ Anchor: 10 });
  });

  it('does not match keywords inside other words', () => {
    // "datasets" is not "data", "teammate" is not "team"
    expect(analyzeObservation('mentioned datasets and a teammate')).toEqual({});
  });

  it('drops a keyword right after a negation', () => {
    expect(analyzeObservation('not direct at all, but chatty')).toEqual({ Spark: 5 });
    expect(analyzeObservation("wasn't warm")).toEqual({});
  });

  it('returns nothing for empty or unrelated text', () => {
    expect(analyzeObservation('')).toEqual({});
    expect(analyzeObservation('wore a blue jacket')).toEqual({});
  });
});

describe('tokenize', () => {
  it('keeps contractions as one token', () => {
    expect(tokenize("He isn't busy.")).toEqual(['he', "isn't", 'busy']);
  });
});
