import { useState } from 'react';
import { AlertTriangle, CheckCircle2, MessageCircle } from 'lucide-react';
import type { Confidence } from '../lib/scoring';
import { TRAITS, type Guidance, type TraitId } from '../lib/traits';
import { ChatModal } from './ChatModal';

interface Props {
  top: TraitId;
  confidence: Confidence;
}

export function GuidancePanel({ top, confidence }: Props) {
  const [chat, setChat] = useState<'do' | 'avoid' | null>(null);

  if (confidence === 'none') {
    return (
      <section className="bg-white rounded-lg shadow-sm p-4 text-sm text-gray-500">
        Answer a question or add a note to see how to approach this client.
      </section>
    );
  }

  const info = TRAITS[top];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GuidanceList
        title="Do this"
        icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
        items={info.doThis}
        titleClass="text-green-700"
        onAsk={() => setChat('do')}
      />
      <GuidanceList
        title="Avoid"
        icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
        items={info.avoid}
        titleClass="text-red-600"
        onAsk={() => setChat('avoid')}
      />
      {confidence === 'low' && (
        <p className="md:col-span-2 text-xs text-amber-700">
          Close call between the top two traits: treat this advice as a guess and ask another
          question.
        </p>
      )}
      {chat && <ChatModal trait={top} topic={chat} onClose={() => setChat(null)} />}
    </div>
  );
}

interface ListProps {
  title: string;
  icon: React.ReactNode;
  items: Guidance[];
  titleClass: string;
  onAsk: () => void;
}

function GuidanceList({ title, icon, items, titleClass, onAsk }: ListProps) {
  return (
    <section className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h2>
      <div className="space-y-4 flex-1">
        {items.map((item) => (
          <div key={item.title} className="space-y-1">
            <h3 className={`font-medium ${titleClass}`}>{item.title}</h3>
            <p className="text-sm text-gray-600">{item.detail}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onAsk}
        className="self-end mt-4 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
      >
        <MessageCircle className="w-4 h-4" />
        Ask a follow-up
      </button>
    </section>
  );
}
