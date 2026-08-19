import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ColorMode, Density, ThemePresetId } from '@/config/theme';

interface PreferencesState {
  colorMode: ColorMode;
  presetId: ThemePresetId;
  density: Density;
  siderCollapsed: boolean;

  setColorMode: (mode: ColorMode) => void;
  setPresetId: (id: ThemePresetId) => void;
  setDensity: (density: Density) => void;
  toggleSider: () => void;
  setSiderCollapsed: (collapsed: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      colorMode: 'system',
      presetId: 'azure',
      density: 'comfortable',
      siderCollapsed: false,

      setColorMode: (colorMode) => set({ colorMode }),
      setPresetId: (presetId) => set({ presetId }),
      setDensity: (density) => set({ density }),
      toggleSider: () =>
        set((state) => ({ siderCollapsed: !state.siderCollapsed })),
      setSiderCollapsed: (siderCollapsed) => set({ siderCollapsed }),
    }),
    { name: 'colony.preferences' },
  ),
);
