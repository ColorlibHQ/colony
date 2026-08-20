import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { ROUTE_PATHS } from '../src/config/routes';

/**
 * The crawl trap, pinned.
 *
 * A blanket `/*  /index.html  200` answers 200 for any URL. A crawler that
 * invents /a/b/c gets a page, finds more invented links, and never terminates.
 * That shape ran up a four-figure Cloudflare bill on another Colorlib demo in
 * 2026, so it is asserted rather than remembered.
 */
const redirects = () =>
  readFileSync(join(process.cwd(), 'dist/_redirects'), 'utf8');

/** Mirrors how Cloudflare Pages matches a `_redirects` line. */
function wouldRewrite(file: string, path: string): boolean {
  return file
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .some((line) => {
      const [from] = line.trim().split(/\s+/);
      if (!from) return false;
      if (from.endsWith('/*')) return path.startsWith(from.slice(0, -1));
      return from === path;
    });
}

describe('_redirects', () => {
  const file = redirects();

  it('contains no catch-all rule', () => {
    // The single most important assertion in this file.
    expect(file).not.toMatch(/^\/\*/m);
  });

  it('rewrites every real route', () => {
    for (const p of ROUTE_PATHS) {
      expect(wouldRewrite(file, p), `${p} should be served`).toBe(true);
    }
  });

  it.each([
    '/invented',
    '/a/b/c/d/e',
    '/dashboard/analysis/../../etc',
    '/wp-admin',
    '/table/1/2/3/4/5',
    '/.env',
  ])('lets %s fall through to a real 404', (path) => {
    expect(wouldRewrite(file, path)).toBe(false);
  });

  it('ships a 404 page for those to land on', () => {
    const html = readFileSync(join(process.cwd(), 'dist/404.html'), 'utf8');
    expect(html).toContain('404');
    // Belt and braces: even if something links to it, it stays out of the index.
    expect(html).toMatch(/name="robots"\s+content="noindex"/);
  });
});
