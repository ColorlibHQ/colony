/**
 * Access model.
 *
 * Ant Design Pro ships `access.ts` — a map of booleans — and no interface for
 * it, so the only way to know what a role can do is to read the source. Here
 * the same model is data, which means it can be rendered, edited and tested.
 *
 * A permission is `resource:action`. Roles hold a set of them; nothing else in
 * the app asks "is this user an admin", only "may this user do this", so adding
 * a role never means hunting for hardcoded role checks.
 */

export const RESOURCES = [
  'dashboard',
  'orders',
  'customers',
  'content',
  'billing',
  'settings',
  'users',
] as const;

export const ACTIONS = ['view', 'create', 'update', 'delete'] as const;

export type Resource = (typeof RESOURCES)[number];
export type Action = (typeof ACTIONS)[number];
export type Permission = `${Resource}:${Action}`;

export const ROLES = ['owner', 'admin', 'editor', 'viewer'] as const;
export type Role = (typeof ROLES)[number];

export function permission(resource: Resource, action: Action): Permission {
  return `${resource}:${action}`;
}

const all = (resource: Resource): Permission[] =>
  ACTIONS.map((a) => permission(resource, a));

/**
 * The shipped defaults. Deliberately not "owner gets a wildcard": an explicit
 * grant list is what the matrix renders, and a wildcard would show as an empty
 * row that silently permits everything.
 */
export const DEFAULT_GRANTS: Record<Role, Permission[]> = {
  owner: RESOURCES.flatMap(all),
  admin: [
    ...all('dashboard'),
    ...all('orders'),
    ...all('customers'),
    ...all('content'),
    'billing:view',
    'settings:view',
    'settings:update',
    'users:view',
    'users:create',
    'users:update',
  ],
  editor: [
    'dashboard:view',
    'orders:view',
    'orders:update',
    'customers:view',
    ...all('content'),
    'settings:view',
  ],
  viewer: [
    'dashboard:view',
    'orders:view',
    'customers:view',
    'content:view',
    'settings:view',
  ],
};

/** Route -> permission required to reach it. Absent means "no permission needed". */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard/analysis': 'dashboard:view',
  '/dashboard/monitor': 'dashboard:view',
  '/dashboard/workplace': 'dashboard:view',
  '/table': 'orders:view',
  '/profile/basic': 'orders:view',
  '/profile/advanced': 'customers:view',
  '/list/basic': 'content:view',
  '/list/card': 'content:view',
  '/list/search': 'content:view',
  '/form/basic': 'content:create',
  '/form/step': 'billing:create',
  '/form/advanced': 'orders:create',
  '/account/center': 'settings:view',
  '/account/settings': 'settings:update',
  '/access': 'users:view',
};
