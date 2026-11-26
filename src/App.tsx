import { useMemo, useState } from 'react';
import { Activity, RotateCcw } from 'lucide-react';
import { QUESTIONS } from './data/questions';
import { applyImpacts, confidence, emptyProfile, rankTraits } from './lib/scoring';
import type { Impacts } from './lib/traits';
import { ObservationInput } from './components/ObservationInput';
import { QuestionPanel } from './components/QuestionPanel';
import { TraitScores } from './components/TraitScores';
import { GuidancePanel } from './components/GuidancePanel';

export default function App() {
  const [profile, setProfile] = useState(emptyProfile);
  const [answered, setAnswered] = useState<string[]>([]);

  const ranked = useMemo(() => rankTraits(profile), [profile]);
  const level = confidence(profile);

  const addEvidence = (impacts: Impacts, questionId?: string) => {
    setProfile((p) => applyImpacts(p, impacts));
    if (questionId) setAnswered((a) => (a.includes(questionId) ? a : [...a, questionId]));
  };

  const reset = () => {
    setProfile(emptyProfile());
    setAnswered([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-7 h-7 text-indigo-600" />
              TraitTrack
            </h1>
            <p className="text-gray-600 mt-1">
              Answer a few quick questions about the client during the meeting. The profile updates
              after every answer.
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Demo: synthetic sample trait model and questions, not a validated assessment.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            New client
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 space-y-6">
            <QuestionPanel
              bank={QUESTIONS}
              profile={profile}
              answered={answered}
              onAnswer={(impacts, id) => addEvidence(impacts, id)}
            />
            <ObservationInput onAnalysis={(impacts) => addEvidence(impacts)} />
          </section>
          <TraitScores ranked={ranked} confidence={level} observations={profile.observations} />
        </div>

        <GuidancePanel top={ranked[0].id} confidence={level} />
      </div>
    </div>
  );
}
