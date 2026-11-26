import { TRAITS, type TraitId } from './traits';

// The "Get more advice" chat. The original prototype faked this reply inline; here
// it sits behind an interface so a real model could be plugged in server-side
// later. The only implementation in this repo is the mock: no network, no key.

export interface AdviceRequest {
  trait: TraitId;
  topic: 'do' | 'avoid';
  question: string;
}

export interface Advisor {
  readonly name: string;
  advise(request: AdviceRequest): Promise<string>;
}

export const MOCK_PREFIX = '[mock advisor]';

/** Answers from the sample do/avoid guidance, so the chat works offline and in tests. */
export const mockAdvisor: Advisor = {
  name: 'mock',
  async advise({ trait, topic, question }) {
    const info = TRAITS[trait];
    const items = topic === 'do' ? info.doThis : info.avoid;
    const words = new Set(question.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
    const match =
      items.find((item) =>
        `${item.title} ${item.detail}`
          .toLowerCase()
          .split(/\W+/)
          .some((w) => words.has(w)),
      ) ?? items[0];
    const verb = topic === 'do' ? 'try' : 'avoid';
    return `${MOCK_PREFIX} For a likely ${trait}, ${verb}: ${match.title}. ${match.detail}`;
  },
};
