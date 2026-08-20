import {
  ROUTE_PERMISSIONS,
  type Permission,
  type Role,
} from '@/config/permissions';

/**
 * Pure access checks, kept out of React so they can be tested directly and
 * reused by the router, the menu filter and component-level gates without
 * three slightly different implementations drifting apart.
 */

export function can(
  grants: Record<Role, Permission[]>,
  role: Role,
  permission: Permission,
): boolean {
  return grants[role]?.includes(permission) ?? false;
}

export function canAny(
  grants: Record<Role, Permission[]>,
  role: Role,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => can(grants, role, p));
}

/**
 * A route with no entry in ROUTE_PERMISSIONS is open. Defaulting to *open*
 * rather than *denied* is a deliberate choice for a template: a forgotten entry
 * shows the page, which is visible and gets reported, instead of silently
 * hiding a feature nobody can explain. Real deployments that need
 * deny-by-default should invert this one line.
 */
export function canAccessRoute(
  grants: Record<Role, Permission[]>,
  role: Role,
  pathname: string,
): boolean {
  const required = ROUTE_PERMISSIONS[pathname];
  if (!required) return true;
  return can(grants, role, required);
}

/** The permission a route needs, or undefined when it is open. */
export function routePermission(pathname: string): Permission | undefined {
  return ROUTE_PERMISSIONS[pathname];
}
