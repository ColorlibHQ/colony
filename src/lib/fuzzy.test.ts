import { describe, expect, it } from 'vitest';

import { fuzzyMatch, rankByFuzzy } from './fuzzy';

describe('fuzzyMatch', () => {
  it('matches a subsequence, not just a substring', () => {
    // The whole point: "dsan" should find "Dashboard · Analysis".
    expect(fuzzyMatch('dsan', 'Dashboard · Analysis').matched).toBe(true);
    expect(fuzzyMatch('thst', 'Theme Studio').matched).toBe(true);
  });

  it('rejects characters that are absent or out of order', () => {
    expect(fuzzyMatch('zzz', 'Dashboard').matched).toBe(false);
    expect(fuzzyMatch('drahsboad', 'Dashboard').matched).toBe(false);
  });

  it('treats an empty query as matching everything', () => {
    expect(fuzzyMatch('', 'anything')).toEqual({
      matched: true,
      score: 0,
      indices: [],
    });
  });

  it('is case-insensitive', () => {
    expect(fuzzyMatch('DASH', 'dashboard').matched).toBe(true);
  });

  it('reports the indices it matched, for highlighting', () => {
    // d-a-s-h-b-o-a-r-d: d=0, s=2, h=3.
    expect(fuzzyMatch('dsh', 'dashboard').indices).toEqual([0, 2, 3]);
  });

  it('matches CJK labels', () => {
    expect(fuzzyMatch('主题', '主题工作室').matched).toBe(true);
    expect(fuzzyMatch('工作室', '主题工作室').matched).toBe(true);
  });

  it('scores a word-start match above a mid-word one', () => {
    const start = fuzzyMatch('an', 'Analysis');
    const middle = fuzzyMatch('an', 'Advanced form');
    expect(start.score).toBeGreaterThan(middle.score);
  });

  it('scores consecutive characters above scattered ones', () => {
    const run = fuzzyMatch('dash', 'dashboard');
    const scattered = fuzzyMatch('dsbr', 'dashboard');
    expect(run.score).toBeGreaterThan(scattered.score);
  });
});

describe('rankByFuzzy', () => {
  const items = [
    { haystack: 'Advanced form /form/advanced' },
    { haystack: 'Analysis /dashboard/analysis' },
    { haystack: 'Account centre /account/center' },
  ];

  it('puts the strongest match first', () => {
    expect(rankByFuzzy('analysis', items)[0]?.haystack).toContain('Analysis');
  });

  it('drops non-matches entirely', () => {
    expect(rankByFuzzy('zzzz', items)).toEqual([]);
  });

  it('returns everything, in order, for an empty query', () => {
    expect(rankByFuzzy('', items).map((i) => i.haystack)).toEqual(
      items.map((i) => i.haystack),
    );
  });

  it('can find a route by its path', () => {
    expect(rankByFuzzy('/account', items)[0]?.haystack).toContain('Account');
  });
});
