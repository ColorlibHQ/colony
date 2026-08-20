import type { ReactNode } from 'react';

import type { Permission } from '@/config/permissions';
import { useCan } from './useCan';

interface CanProps {
  permission: Permission;
  children: ReactNode;
  /** Rendered instead when the permission is missing. Defaults to nothing. */
  fallback?: ReactNode;
}

/**
 * Component-level gate.
 *
 * Hides rather than disables: a disabled control still advertises a capability
 * the user does not have, and invites a support ticket asking why it is greyed
 * out. Pass a fallback when the absence would be confusing on its own.
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const can = useCan();
  return <>{can(permission) ? children : fallback}</>;
}
