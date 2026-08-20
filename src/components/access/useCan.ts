import { useCallback } from 'react';

import type { Permission } from '@/config/permissions';
import { can, canAccessRoute } from '@/lib/access';
import { useAuth } from '@/stores/auth';

/**
 * The single hook every gate uses. Returning a callback rather than a boolean
 * lets one call site check several permissions without a hook per check.
 */
export function useCan() {
  const role = useAuth((s) => s.role);
  const grants = useAuth((s) => s.grants);

  return useCallback(
    (permission: Permission) => can(grants, role, permission),
    [grants, role],
  );
}

export function useCanAccessRoute() {
  const role = useAuth((s) => s.role);
  const grants = useAuth((s) => s.grants);

  return useCallback(
    (pathname: string) => canAccessRoute(grants, role, pathname),
    [grants, role],
  );
}
