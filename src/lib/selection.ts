import { rankTraits, type Profile } from './scoring';
import { TRAIT_IDS, type Impacts } from './traits';

export interface QuestionOption {
  text: string;
  impacts: Impacts;
}

export interface Question {
  id: string;
  tag: string;
  text: string;
  options: QuestionOption[];
}

/**
 * How well a question separates trait `a` from trait `b`: the mean absolute gap
 * between the points its options give to each. 0 means no answer can tell them apart.
 */
export function separation(question: Question, a: string, b: string): number {
  if (question.options.length === 0) return 0;
  const gap = question.options.reduce((sum, option) => {
    const impacts = option.impacts as Record<string, number | undefined>;
    return sum + Math.abs((impacts[a] ?? 0) - (impacts[b] ?? 0));
  }, 0);
  return gap / question.options.length;
}

/** Mean separation over every pair of traits; used before there is any evidence. */
export function spread(question: Question): number {
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < TRAIT_IDS.length; i++) {
    for (let j = i + 1; j < TRAIT_IDS.length; j++) {
      total += separation(question, TRAIT_IDS[i], TRAIT_IDS[j]);
      pairs++;
    }
  }
  return pairs === 0 ? 0 : total / pairs;
}

export interface SelectOptions {
  /** Question ids already answered for this client. */
  answered?: Iterable<string>;
  /** Only consider questions with this tag. */
  tag?: string;
}

/**
 * Picks the next question to ask. With no evidence yet it picks the question that
 * spreads all traits furthest apart; after that it picks the unanswered question
 * that best separates the current top two traits, so each answer goes where the
 * profile is least sure. Ties keep bank order. Returns null when nothing is left.
 */
export function nextQuestion(
  bank: Question[],
  profile: Profile,
  { answered = [], tag }: SelectOptions = {},
): Question | null {
  const done = new Set(answered);
  const candidates = bank.filter((q) => !done.has(q.id) && (tag === undefined || q.tag === tag));
  if (candidates.length === 0) return null;

  const [first, second] = rankTraits(profile);
  const score =
    profile.observations === 0
      ? (q: Question) => spread(q)
      : (q: Question) => separation(q, first.id, second.id);

  let best = candidates[0];
  let bestScore = score(best);
  for (const q of candidates.slice(1)) {
    const s = score(q);
    if (s > bestScore) {
      best = q;
      bestScore = s;
    }
  }
  return best;
}
