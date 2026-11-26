// SYNTHETIC SAMPLE TRAIT MODEL.
// Made up for this public demo on two plain axes: pace (quick or deliberate) and
// focus (people or facts). It is not Mindreader's framework and has not been
// validated against anything. Swap in your own model by editing this file and
// src/data/questions.ts; the scoring and selection logic does not care.

export const TRAIT_IDS = ['Sprinter', 'Spark', 'Anchor', 'Analyst'] as const;
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
  axes: { pace: 'quick' | 'deliberate'; focus: 'people' | 'facts' };
  doThis: Guidance[];
  avoid: Guidance[];
}

export const TRAITS: Record<TraitId, TraitInfo> = {
  Sprinter: {
    id: 'Sprinter',
    summary: 'Quick and fact-focused: wants the outcome, the cost and the next step.',
    axes: { pace: 'quick', focus: 'facts' },
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
  Spark: {
    id: 'Spark',
    summary: 'Quick and people-focused: energised by ideas, stories and what is new.',
    axes: { pace: 'quick', focus: 'people' },
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
  Anchor: {
    id: 'Anchor',
    summary: 'Deliberate and people-focused: wants trust, steadiness and care for others affected.',
    axes: { pace: 'deliberate', focus: 'people' },
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
  Analyst: {
    id: 'Analyst',
    summary: 'Deliberate and fact-focused: wants evidence, detail and time to check it.',
    axes: { pace: 'deliberate', focus: 'facts' },
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
