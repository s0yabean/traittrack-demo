import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { mockAdvisor, type Advisor } from '../lib/advisor';
import type { TraitId } from '../lib/traits';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  trait: TraitId;
  topic: 'do' | 'avoid';
  onClose: () => void;
  advisor?: Advisor;
}

export function ChatModal({ trait, topic, onClose, advisor = mockAdvisor }: Props) {
  const label = topic === 'do' ? 'what to do' : 'what to avoid';
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Ask about ${label} with a likely ${trait}.` },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setBusy(true);
    try {
      const reply = await advisor.advise({ trait, topic, question });
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[600px] max-h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {trait}: {label}
            {advisor.name === 'mock' && <span className="ml-2 text-xs text-gray-500">(mock advisor)</span>}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. How do I handle the price question?"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={busy}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
