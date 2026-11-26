// Trait names and one-line summaries follow Mindreader's public four-type model
// (Knight, Explorer, Healer, Wizard). The do/avoid guidance below is an
// illustrative sample written for this demo, not Mindreader's training content.
// Swap in your own model by editing this file and src/data/questions.ts; the
// scoring and selection logic does not depend on the trait names.

export const TRAIT_IDS = ['Knight', 'Explorer', 'Healer', 'Wizard'] as const;
export type TraitId = (typeof TRAIT_IDS)[number];

/** Evidence points per trait. Missing traits count as 0. */
export type Impacts = Partial<Record<TraitId, number>>;

export interface Guidance {
  title: string;
  detail: string;
}

export interface TraitInfo {
  id: TraitId;
  summary: string;
  doThis: Guidance[];
  avoid: Guidance[];
}

export const TRAITS: Record<TraitId, TraitInfo> = {
  Knight: {
    id: 'Knight',
    summary: 'Direct decision-makers focused on results and efficiency.',
    doThis: [
      { title: 'Lead with the result', detail: 'Open with what changes for them and by when.' },
      { title: 'Give one clear option', detail: 'Recommend, then offer detail only if asked.' },
      { title: 'Name the next step', detail: 'End with a concrete action and a date.' },
    ],
    avoid: [
      { title: 'Long warm-ups', detail: 'Keep small talk short unless they start it.' },
      { title: 'Hedging', detail: 'Vague answers read as not knowing.' },
    ],
  },
  Explorer: {
    id: 'Explorer',
    summary: 'Innovation-focused risk-takers who value creativity.',
    doThis: [
      { title: 'Tell a short story', detail: 'Show a client like them who got a result.' },
      { title: 'Keep it moving', detail: 'Short sections, visuals, room to react.' },
      { title: 'Invite their ideas', detail: 'Ask how they would use it.' },
    ],
    avoid: [
      { title: 'Reading the deck', detail: 'Dense slides lose them fast.' },
      { title: 'Closing the door on options', detail: 'Show that there is room to adapt later.' },
    ],
  },
  Healer: {
    id: 'Healer',
    summary: 'Relationship-focused problem solvers who prioritize harmony.',
    doThis: [
      { title: 'Build the relationship first', detail: 'Ask about their team and who else is involved.' },
      { title: 'Explain the support', detail: 'Who they call, how fast, what happens if it goes wrong.' },
      { title: 'Give time', detail: 'Offer to follow up after they have talked to others.' },
    ],
    avoid: [
      { title: 'Pressure', detail: 'Deadlines and scarcity push them away.' },
      { title: 'Only numbers', detail: 'Say what it means for the people, too.' },
    ],
  },
  Wizard: {
    id: 'Wizard',
    summary: 'Analytical and detail-oriented strategic thinkers.',
    doThis: [
      { title: 'Bring the evidence', detail: 'Numbers, sources and how they were measured.' },
      { title: 'Show the trade-offs', detail: 'Say what it does not do as well as what it does.' },
      { title: 'Send it in writing', detail: 'A short document they can review later.' },
    ],
    avoid: [
      { title: 'Claims without proof', detail: 'Every claim invites a follow-up question.' },
      { title: 'Rushing the decision', detail: 'They decide after they have checked.' },
    ],
  },
};
