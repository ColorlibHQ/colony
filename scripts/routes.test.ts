import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { ROUTE_PATHS } from '../src/config/routes';

/**
 * Lives in scripts/, not src/, because it reads the filesystem — `src` is
 * browser-scoped and deliberately has no Node types.
 *
 * ROUTE_PATHS tells the host which URLs are real, so unknown paths can return a
 * genuine 404 instead of the SPA answering 200 for everything. If a route is
 * added to the router and not here, it 404s in production while working
 * perfectly in dev — the worst kind of drift. So it is checked, not trusted.
 */
function routerPaths(): string[] {
  // cwd, not import.meta.url: under the jsdom environment the latter is not a
  // file: URL and readFileSync rejects it.
  const src = readFileSync(join(process.cwd(), 'src/app/router.tsx'), 'utf8');

  const paths: string[] = [];
  let parent = '';

  for (const [, value] of src.matchAll(/path:\s*'([^']+)'/g)) {
    if (value === '*') continue; // the catch-all is not a real path
    if (value.startsWith('/')) {
      // A layout root. Everything after it, until the next root, hangs off it.
      parent = value === '/' ? '' : value;
      paths.push(value);
    } else {
      paths.push(`${parent}/${value}`);
    }
  }

  return [...new Set(paths)];
}

describe('ROUTE_PATHS', () => {
  const fromRouter = routerPaths();

  it('finds routes in the router at all (guards the parser itself)', () => {
    expect(fromRouter.length).toBeGreaterThan(20);
  });

  it('lists every route the router defines', () => {
    const missing = fromRouter.filter((p) => !ROUTE_PATHS.includes(p as never));
    expect(missing, 'add these to src/config/routes.ts').toEqual([]);
  });

  it('lists no route the router does not define', () => {
    const known = new Set<string>(fromRouter);
    const extra = ROUTE_PATHS.filter((p) => !known.has(p));
    expect(extra, 'these are in routes.ts but not in the router').toEqual([]);
  });

  it('has no duplicates and every entry is absolute', () => {
    expect(new Set(ROUTE_PATHS).size).toBe(ROUTE_PATHS.length);
    for (const p of ROUTE_PATHS) expect(p.startsWith('/')).toBe(true);
  });
});
