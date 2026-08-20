import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  DEFAULT_GRANTS,
  type Permission,
  type Role,
} from '@/config/permissions';

interface AuthState {
  role: Role;
  /** Grants per role, editable from the access matrix. */
  grants: Record<Role, Permission[]>;

  setRole: (role: Role) => void;
  toggleGrant: (role: Role, permission: Permission) => void;
  setRoleGrants: (role: Role, permissions: Permission[]) => void;
  resetGrants: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      role: 'owner',
      grants: DEFAULT_GRANTS,

      setRole: (role) => set({ role }),

      toggleGrant: (role, permission) =>
        set((state) => {
          const current = state.grants[role];
          const next = current.includes(permission)
            ? current.filter((p) => p !== permission)
            : [...current, permission];
          return { grants: { ...state.grants, [role]: next } };
        }),

      setRoleGrants: (role, permissions) =>
        set((state) => ({ grants: { ...state.grants, [role]: permissions } })),

      resetGrants: () => set({ grants: DEFAULT_GRANTS }),
    }),
    { name: 'colony.auth' },
  ),
);
