import { describe, expect, it, vi } from 'vitest';
import { MOCK_PREFIX, mockAdvisor } from '../src/lib/advisor';
import { TRAITS } from '../src/lib/traits';

describe('mockAdvisor', () => {
  it('answers offline, labelled as mock, without calling fetch', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const reply = await mockAdvisor.advise({ trait: 'Wizard', topic: 'do', question: 'help' });
    expect(reply.startsWith(MOCK_PREFIX)).toBe(true);
    expect(reply).toContain('Wizard');
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('picks the guidance item that matches the question', async () => {
    const reply = await mockAdvisor.advise({
      trait: 'Healer',
      topic: 'do',
      question: 'Who do they call for support?',
    });
    expect(reply).toContain('Explain the support');
  });

  it('falls back to the first item for the topic', async () => {
    const reply = await mockAdvisor.advise({ trait: 'Knight', topic: 'avoid', question: 'hm' });
    expect(reply).toContain(TRAITS.Knight.avoid[0].title);
  });
});
