import { useState } from 'react';
import { analyzeObservation } from '../lib/observation';
import type { Impacts } from '../lib/traits';

interface Props {
  onAnalysis: (impacts: Impacts) => void;
}

export function ObservationInput({ onAnalysis }: Props) {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const impacts = analyzeObservation(text);
    const hits = Object.entries(impacts).map(([trait, points]) => `${trait} +${points}`);
    setFeedback(hits.length > 0 ? `Added: ${hits.join(', ')}` : 'No known keywords found; nothing added.');
    onAnalysis(impacts);
    setText('');
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700" htmlFor="observation">
        Free-text note
      </label>
      <textarea
        id="observation"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='e.g. "Very direct, asked for the numbers twice"'
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        rows={3}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add note
        </button>
        {feedback && <span className="text-sm text-gray-500">{feedback}</span>}
      </div>
    </form>
  );
}
