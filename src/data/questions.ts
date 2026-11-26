import type { Question } from '../lib/selection';

// SYNTHETIC SAMPLE QUESTION BANK for the made-up trait model in src/lib/traits.ts.
// Written for this public demo; not Mindreader's question bank. Each option adds
// evidence points to one or two traits. The salesperson answers from what they
// see in the meeting; the client never sees the quiz.

export const QUESTIONS: Question[] = [
  {
    id: 'opening',
    tag: 'Opening',
    text: 'How did they open the meeting?',
    options: [
      { text: 'Straight to the agenda', impacts: { Sprinter: 10, Analyst: 4 } },
      { text: 'With a story or a joke', impacts: { Spark: 10, Anchor: 4 } },
      { text: 'Asked how you and your team are', impacts: { Anchor: 10, Spark: 4 } },
      { text: 'With a question about your data', impacts: { Analyst: 10, Sprinter: 4 } },
    ],
  },
  {
    id: 'pace',
    tag: 'Pace',
    text: 'How fast do they want to move?',
    options: [
      { text: 'Wants a decision today', impacts: { Sprinter: 12, Spark: 4 } },
      { text: 'Jumps between topics', impacts: { Spark: 12 } },
      { text: 'Wants to check with others first', impacts: { Anchor: 12 } },
      { text: 'Wants to review the details first', impacts: { Analyst: 12, Anchor: 2 } },
    ],
  },
  {
    id: 'questions-asked',
    tag: 'Questions',
    text: 'What kind of questions do they ask?',
    options: [
      { text: 'What does it cost, when does it start?', impacts: { Sprinter: 10 } },
      { text: 'Who else uses it?', impacts: { Spark: 6, Anchor: 6 } },
      { text: 'How will my team find it?', impacts: { Anchor: 10 } },
      { text: 'How was that number measured?', impacts: { Analyst: 12 } },
    ],
  },
  {
    id: 'materials',
    tag: 'Materials',
    text: 'What do they do with the materials you show?',
    options: [
      { text: 'Skips to the summary page', impacts: { Sprinter: 10, Spark: 3 } },
      { text: 'Reacts to the pictures and examples', impacts: { Spark: 10 } },
      { text: 'Asks for a copy to share', impacts: { Anchor: 8, Analyst: 3 } },
      { text: 'Reads the footnotes', impacts: { Analyst: 12 } },
    ],
  },
  {
    id: 'objection',
    tag: 'Objections',
    text: 'What is their main concern?',
    options: [
      { text: 'It will take too long', impacts: { Sprinter: 12 } },
      { text: 'It sounds like what they already have', impacts: { Spark: 10, Sprinter: 3 } },
      { text: 'It could upset their team or clients', impacts: { Anchor: 12 } },
      { text: 'The evidence is not strong enough', impacts: { Analyst: 12 } },
    ],
  },
  {
    id: 'decision',
    tag: 'Decision',
    text: 'How do they say they make decisions?',
    options: [
      { text: 'On their own, quickly', impacts: { Sprinter: 12, Spark: 3 } },
      { text: 'On gut feel', impacts: { Spark: 12 } },
      { text: 'Together with the people affected', impacts: { Anchor: 12 } },
      { text: 'After comparing the options', impacts: { Analyst: 12, Sprinter: 3 } },
    ],
  },
  {
    id: 'small-talk',
    tag: 'Small talk',
    text: 'How do they handle small talk?',
    options: [
      { text: 'Keeps it to a minute', impacts: { Sprinter: 8, Analyst: 4 } },
      { text: 'Starts most of it', impacts: { Spark: 8, Anchor: 4 } },
      { text: 'Remembers details from last time', impacts: { Anchor: 10 } },
      { text: 'Turns it to a topic they know well', impacts: { Analyst: 8, Spark: 2 } },
    ],
  },
  {
    id: 'follow-up',
    tag: 'Follow-up',
    text: 'What follow-up do they ask for?',
    options: [
      { text: 'A proposal by tomorrow', impacts: { Sprinter: 10 } },
      { text: 'A demo for a colleague', impacts: { Spark: 6, Anchor: 6 } },
      { text: 'A call with an existing client', impacts: { Anchor: 10, Analyst: 2 } },
      { text: 'The full technical document', impacts: { Analyst: 12 } },
    ],
  },
  {
    id: 'time',
    tag: 'Time',
    text: 'How do they treat the meeting time?',
    options: [
      { text: 'Ends early once they have what they need', impacts: { Sprinter: 10 } },
      { text: 'Runs over without noticing', impacts: { Spark: 10, Anchor: 3 } },
      { text: 'Makes time for everyone to speak', impacts: { Anchor: 10 } },
      { text: 'Sticks to the agenda point by point', impacts: { Analyst: 8, Sprinter: 4 } },
    ],
  },
  {
    id: 'risk',
    tag: 'Risk',
    text: 'How do they talk about risk?',
    options: [
      { text: 'Bigger risk is doing nothing', impacts: { Sprinter: 8, Spark: 6 } },
      { text: 'Excited by trying something new', impacts: { Spark: 10 } },
      { text: 'Worried about disruption to people', impacts: { Anchor: 10 } },
      { text: 'Wants the risks listed and sized', impacts: { Analyst: 10, Anchor: 2 } },
    ],
  },
];

export const TAGS: string[] = [...new Set(QUESTIONS.map((q) => q.tag))];
