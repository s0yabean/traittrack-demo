import type { Confidence, RankedTrait } from '../lib/scoring';
import { TRAITS } from '../lib/traits';

interface Props {
  ranked: RankedTrait[];
  confidence: Confidence;
  observations: number;
}

const LABELS: Record<Confidence, { text: string; className: string }> = {
  none: { text: 'No evidence yet', className: 'bg-gray-100 text-gray-600' },
  low: { text: 'Low: close call', className: 'bg-amber-100 text-amber-800' },
  medium: { text: 'Medium', className: 'bg-indigo-100 text-indigo-800' },
  high: { text: 'High', className: 'bg-green-100 text-green-800' },
};

export function TraitScores({ ranked, confidence, observations }: Props) {
  const label = LABELS[confidence];
  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800">Likely trait</h2>
      <div className="flex items-center gap-2 mt-1 mb-4 text-xs">
        <span className={`px-2 py-0.5 rounded-full ${label.className}`}>{label.text}</span>
        <span className="text-gray-500">
          {observations} observation{observations === 1 ? '' : 's'}
        </span>
      </div>
      <div className="space-y-4">
        {ranked.map(({ id, percent }, i) => (
          <div key={id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">
                {id}
                {i === 0 && observations > 0 && ' (leading)'}
              </span>
              <span className="text-sm text-gray-500">{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{TRAITS[id].summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
