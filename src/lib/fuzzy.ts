/**
 * Subsequence matching for the command palette.
 *
 * Deliberately hand-rolled rather than pulling a fuzzy-search library: the
 * whole feature is one modal over a list of maybe forty commands, and a 15 kB
 * dependency for that would undercut the bundle budget the rest of the project
 * is held to.
 *
 * The rule is subsequence, not substring — "dsan" should find "Dashboard ·
 * Analysis" — with scoring that prefers matches at word starts, so typing "an"
 * ranks "Analysis" above "Adv*an*ced form".
 */

export interface FuzzyResult {
  matched: boolean;
  score: number;
  /** Indices of matched characters, for highlighting. */
  indices: number[];
}

const NO_MATCH: FuzzyResult = { matched: false, score: 0, indices: [] };

function isBoundary(text: string, i: number): boolean {
  if (i === 0) return true;
  const prev = text[i - 1]!;
  return prev === ' ' || prev === '/' || prev === '-' || prev === '·';
}

export function fuzzyMatch(query: string, text: string): FuzzyResult {
  const q = query.trim().toLowerCase();
  if (!q) return { matched: true, score: 0, indices: [] };

  const haystack = text.toLowerCase();
  const indices: number[] = [];
  let score = 0;
  let cursor = 0;
  let streak = 0;

  for (const char of q) {
    // CJK queries are usually contiguous, and so are Latin ones once past the
    // first character; searching forward from the cursor keeps order intact.
    const found = haystack.indexOf(char, cursor);
    if (found === -1) return NO_MATCH;

    if (found === cursor && indices.length > 0) {
      streak += 1;
      score += 4 + streak; // consecutive characters are a strong signal
    } else {
      streak = 0;
      score += 1;
    }
    if (isBoundary(text, found)) score += 6;
    // Later matches are weaker: an early hit usually means the right item.
    score -= Math.min(found - cursor, 8) * 0.25;

    indices.push(found);
    cursor = found + 1;
  }

  // A short label matching the whole query beats a long one that merely contains it.
  score += Math.max(0, 12 - text.length * 0.1);
  if (haystack.startsWith(q)) score += 10;

  return { matched: true, score, indices };
}

export interface Rankable {
  /** Everything worth matching against, joined. */
  haystack: string;
}

/** Ranks best-first and drops non-matches. Ties keep their original order. */
export function rankByFuzzy<T extends Rankable>(
  query: string,
  items: T[],
): (T & { score: number; indices: number[] })[] {
  return items
    .map((item, i) => {
      const r = fuzzyMatch(query, item.haystack);
      return { item, r, i };
    })
    .filter(({ r }) => r.matched)
    .sort((a, b) => b.r.score - a.r.score || a.i - b.i)
    .map(({ item, r }) => ({ ...item, score: r.score, indices: r.indices }));
}
