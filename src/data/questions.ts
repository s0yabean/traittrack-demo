import type { Question } from '../lib/selection';

// ILLUSTRATIVE SAMPLE QUESTION BANK, written for this public demo; not
// Mindreader's question bank. Trait names follow src/lib/traits.ts. Each option adds
// evidence points to one or two traits. The salesperson answers from what they
// see in the meeting; the client never sees the quiz.

export const QUESTIONS: Question[] = [
  {
    id: 'opening',
    tag: 'Opening',
    text: 'How did they open the meeting?',
    options: [
      { text: 'Straight to the agenda', impacts: { Knight: 10, Wizard: 4 } },
      { text: 'With a story or a joke', impacts: { Explorer: 10, Healer: 4 } },
      { text: 'Asked how you and your team are', impacts: { Healer: 10, Explorer: 4 } },
      { text: 'With a question about your data', impacts: { Wizard: 10, Knight: 4 } },
    ],
  },
  {
    id: 'pace',
    tag: 'Pace',
    text: 'How fast do they want to move?',
    options: [
      { text: 'Wants a decision today', impacts: { Knight: 12, Explorer: 4 } },
      { text: 'Jumps between topics', impacts: { Explorer: 12 } },
      { text: 'Wants to check with others first', impacts: { Healer: 12 } },
      { text: 'Wants to review the details first', impacts: { Wizard: 12, Healer: 2 } },
    ],
  },
  {
    id: 'questions-asked',
    tag: 'Questions',
    text: 'What kind of questions do they ask?',
    options: [
      { text: 'What does it cost, when does it start?', impacts: { Knight: 10 } },
      { text: 'Who else uses it?', impacts: { Explorer: 6, Healer: 6 } },
      { text: 'How will my team find it?', impacts: { Healer: 10 } },
      { text: 'How was that number measured?', impacts: { Wizard: 12 } },
    ],
  },
  {
    id: 'materials',
    tag: 'Materials',
    text: 'What do they do with the materials you show?',
    options: [
      { text: 'Skips to the summary page', impacts: { Knight: 10, Explorer: 3 } },
      { text: 'Reacts to the pictures and examples', impacts: { Explorer: 10 } },
      { text: 'Asks for a copy to share', impacts: { Healer: 8, Wizard: 3 } },
      { text: 'Reads the footnotes', impacts: { Wizard: 12 } },
    ],
  },
  {
    id: 'objection',
    tag: 'Objections',
    text: 'What is their main concern?',
    options: [
      { text: 'It will take too long', impacts: { Knight: 12 } },
      { text: 'It sounds like what they already have', impacts: { Explorer: 10, Knight: 3 } },
      { text: 'It could upset their team or clients', impacts: { Healer: 12 } },
      { text: 'The evidence is not strong enough', impacts: { Wizard: 12 } },
    ],
  },
  {
    id: 'decision',
    tag: 'Decision',
    text: 'How do they say they make decisions?',
    options: [
      { text: 'On their own, quickly', impacts: { Knight: 12, Explorer: 3 } },
      { text: 'On gut feel', impacts: { Explorer: 12 } },
      { text: 'Together with the people affected', impacts: { Healer: 12 } },
      { text: 'After comparing the options', impacts: { Wizard: 12, Knight: 3 } },
    ],
  },
  {
    id: 'small-talk',
    tag: 'Small talk',
    text: 'How do they handle small talk?',
    options: [
      { text: 'Keeps it to a minute', impacts: { Knight: 8, Wizard: 4 } },
      { text: 'Starts most of it', impacts: { Explorer: 8, Healer: 4 } },
      { text: 'Remembers details from last time', impacts: { Healer: 10 } },
      { text: 'Turns it to a topic they know well', impacts: { Wizard: 8, Explorer: 2 } },
    ],
  },
  {
    id: 'follow-up',
    tag: 'Follow-up',
    text: 'What follow-up do they ask for?',
    options: [
      { text: 'A proposal by tomorrow', impacts: { Knight: 10 } },
      { text: 'A demo for a colleague', impacts: { Explorer: 6, Healer: 6 } },
      { text: 'A call with an existing client', impacts: { Healer: 10, Wizard: 2 } },
      { text: 'The full technical document', impacts: { Wizard: 12 } },
    ],
  },
  {
    id: 'time',
    tag: 'Time',
    text: 'How do they treat the meeting time?',
    options: [
      { text: 'Ends early once they have what they need', impacts: { Knight: 10 } },
      { text: 'Runs over without noticing', impacts: { Explorer: 10, Healer: 3 } },
      { text: 'Makes time for everyone to speak', impacts: { Healer: 10 } },
      { text: 'Sticks to the agenda point by point', impacts: { Wizard: 8, Knight: 4 } },
    ],
  },
  {
    id: 'risk',
    tag: 'Risk',
    text: 'How do they talk about risk?',
    options: [
      { text: 'Bigger risk is doing nothing', impacts: { Knight: 8, Explorer: 6 } },
      { text: 'Excited by trying something new', impacts: { Explorer: 10 } },
      { text: 'Worried about disruption to people', impacts: { Healer: 10 } },
      { text: 'Wants the risks listed and sized', impacts: { Wizard: 10, Healer: 2 } },
    ],
  },
];

export const TAGS: string[] = [...new Set(QUESTIONS.map((q) => q.tag))];
