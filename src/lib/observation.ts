import { TRAIT_IDS, type Impacts, type TraitId } from './traits';

// Free-text notes ("very direct, asked for the numbers") scored by keyword.
// Deliberately simple and transparent: whole-word matches only, and a negation
// word just before a keyword ("not direct") cancels it. An LLM or a trained
// classifier could replace this behind the same function signature.

export const POINTS_PER_KEYWORD = 5;

export const KEYWORDS: Record<TraitId, string[]> = {
  Sprinter: ['direct', 'decisive', 'brief', 'impatient', 'results', 'deadline', 'busy'],
  Spark: ['excited', 'chatty', 'story', 'stories', 'ideas', 'enthusiastic', 'spontaneous'],
  Anchor: ['warm', 'team', 'family', 'trust', 'careful', 'loyal', 'consensus'],
  Analyst: ['numbers', 'data', 'evidence', 'detail', 'details', 'technical', 'research'],
};

const NEGATIONS = new Set(['not', 'never', 'no', "isn't", "wasn't", 'hardly']);

export function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
}

export function analyzeObservation(text: string): Impacts {
  const tokens = tokenize(text);
  const impacts: Impacts = {};
  for (const id of TRAIT_IDS) {
    const words = new Set(KEYWORDS[id]);
    let matches = 0;
    tokens.forEach((token, i) => {
      if (!words.has(token)) return;
      const previous = tokens[i - 1];
      if (previous !== undefined && NEGATIONS.has(previous)) return;
      matches++;
    });
    if (matches > 0) impacts[id] = matches * POINTS_PER_KEYWORD;
  }
  return impacts;
}
