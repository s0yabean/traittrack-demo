import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TAGS } from '../data/questions';
import type { Profile } from '../lib/scoring';
import { nextQuestion, type Question } from '../lib/selection';
import type { Impacts } from '../lib/traits';

interface Props {
  bank: Question[];
  profile: Profile;
  answered: string[];
  onAnswer: (impacts: Impacts, questionId: string) => void;
}

export function QuestionPanel({ bank, profile, answered, onAnswer }: Props) {
  const [tag, setTag] = useState<string | null>(null);
  const question = nextQuestion(bank, profile, { answered, tag: tag ?? undefined });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <TagButton label="Suggested" active={tag === null} onClick={() => setTag(null)} />
        {TAGS.map((t) => (
          <TagButton key={t} label={t} active={t === tag} onClick={() => setTag(t === tag ? null : t)} />
        ))}
      </div>

      {question ? (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {tag === null && <Sparkles className="w-3 h-3 text-indigo-500" />}
            {tag === null ? 'Next best question' : question.tag} · {answered.length} of {bank.length}{' '}
            answered
          </div>
          <h3 className="font-medium text-gray-800">{question.text}</h3>
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option.text}
                onClick={() => onAnswer(option.impacts, question.id)}
                className="w-full p-3 text-sm bg-white border rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-left"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          {tag === null ? 'All questions answered.' : `No questions left under "${tag}".`} Add a
          free-text note below if you have more to go on.
        </p>
      )}
    </div>
  );
}

function TagButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      }`}
    >
      {label}
    </button>
  );
}
