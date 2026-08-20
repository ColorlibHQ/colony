import { describe, expect, it } from 'vitest';

import { DEFAULT_GRANTS, ROLES } from '@/config/permissions';
import { can, canAccessRoute, canAny } from './access';

const G = DEFAULT_GRANTS;

describe('can', () => {
  it('grants what the role holds and denies what it does not', () => {
    expect(can(G, 'viewer', 'orders:view')).toBe(true);
    expect(can(G, 'viewer', 'orders:delete')).toBe(false);
  });

  it('denies an unknown role rather than throwing', () => {
    expect(can(G, 'nobody' as never, 'orders:view')).toBe(false);
  });
});

describe('canAny', () => {
  it('is true when at least one permission is held', () => {
    expect(canAny(G, 'viewer', ['orders:delete', 'orders:view'])).toBe(true);
  });

  it('is false for an empty list', () => {
    expect(canAny(G, 'owner', [])).toBe(false);
  });
});

describe('canAccessRoute', () => {
  it('gates a route behind its permission', () => {
    expect(canAccessRoute(G, 'viewer', '/table')).toBe(true);
    expect(canAccessRoute(G, 'viewer', '/access')).toBe(false);
    expect(canAccessRoute(G, 'admin', '/access')).toBe(true);
  });

  /** Documented default: unlisted routes are open, so a forgotten entry is
   *  visible rather than a silently missing feature. */
  it('treats an unlisted route as open', () => {
    expect(canAccessRoute(G, 'viewer', '/components/cards')).toBe(true);
  });
});

describe('default grants', () => {
  it('gives owner strictly the most permissions', () => {
    const counts = ROLES.map((r) => G[r].length);
    expect(Math.max(...counts)).toBe(G.owner.length);
    expect(G.owner.length).toBeGreaterThan(G.admin.length);
    expect(G.admin.length).toBeGreaterThan(G.editor.length);
    expect(G.editor.length).toBeGreaterThan(G.viewer.length);
  });

  it('contains no duplicates', () => {
    for (const role of ROLES) {
      expect(new Set(G[role]).size).toBe(G[role].length);
    }
  });

  it('only ever grants well-formed resource:action pairs', () => {
    for (const role of ROLES) {
      for (const p of G[role]) {
        expect(p).toMatch(/^[a-z]+:(view|create|update|delete)$/);
      }
    }
  });

  it('never grants a write without the matching view', () => {
    // A role that can edit orders but cannot open them is a broken state that
    // renders as an empty screen with an enabled save button.
    for (const role of ROLES) {
      for (const p of G[role]) {
        const [resource, action] = p.split(':');
        if (action !== 'view') {
          expect(
            G[role],
            `${role} can ${p} but not ${resource}:view`,
          ).toContain(`${resource}:view`);
        }
      }
    }
  });
});
