import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { ROUTE_PATHS } from '../src/config/routes';

/**
 * The crawl trap, pinned.
 *
 * A blanket `/*  /index.html  200` answers 200 for any URL: a crawler that
 * invents /a/b/c gets a page, finds more invented links, and never terminates.
 * That shape ran up a four-figure Cloudflare bill on another Colorlib demo in
 * 2026, so it is asserted rather than remembered.
 *
 * The build emits a real index.html per route instead, so unknown paths have no
 * file and fall through to a genuine 404.
 */
const dist = (p: string) => join(process.cwd(), 'dist', p);

describe('route shells', () => {
  it('emits a real html file for every route', () => {
    for (const route of ROUTE_PATHS) {
      const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
      expect(existsSync(dist(file)), `missing shell for ${route}`).toBe(true);
    }
  });

  it('emits no file for paths that do not exist', () => {
    for (const p of ['a/b/c/d/e', 'wp-admin', 'nope', 'table/1/2/3']) {
      expect(existsSync(dist(`${p}.html`)), `${p} should not exist`).toBe(false);
      expect(existsSync(dist(join(p, 'index.html')))).toBe(false);
    }
  });

  it('ships no catch-all rewrite', () => {
    // The single most important assertion here. A _redirects file is allowed to
    // exist, but never with a wildcard that resurrects the trap.
    if (!existsSync(dist('_redirects'))) return;
    expect(readFileSync(dist('_redirects'), 'utf8')).not.toMatch(/^\/\*/m);
  });

  it('ships a 404 page for unknown paths to land on', () => {
    const html = readFileSync(dist('404.html'), 'utf8');
    expect(html).toContain('404');
    expect(html).toMatch(/name="robots"\s+content="noindex"/);
  });

  it('every shell references the built bundle, not a dev entry', () => {
    const shell = readFileSync(dist('table.html'), 'utf8');
    expect(shell).toMatch(/assets\/[\w-]+\.js/);
    expect(shell).not.toContain('/src/main.tsx');
  });
});
