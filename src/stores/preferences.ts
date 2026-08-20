import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ColorMode, Density, ThemePresetId } from '@/config/theme';

interface PreferencesState {
  colorMode: ColorMode;
  presetId: ThemePresetId;
  density: Density;
  siderCollapsed: boolean;
  /** Theme Studio overrides. null = follow the active preset. */
  customPrimary: string | null;
  customRadius: number | null;

  setColorMode: (mode: ColorMode) => void;
  setPresetId: (id: ThemePresetId) => void;
  setCustomPrimary: (hex: string | null) => void;
  setCustomRadius: (radius: number | null) => void;
  resetCustom: () => void;
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
      customPrimary: null,
      customRadius: null,

      setColorMode: (colorMode) => set({ colorMode }),
      // Choosing a preset discards any hand-edited tokens — otherwise the
      // swatch you clicked and the colour you get disagree.
      setPresetId: (presetId) =>
        set({ presetId, customPrimary: null, customRadius: null }),
      setCustomPrimary: (customPrimary) => set({ customPrimary }),
      setCustomRadius: (customRadius) => set({ customRadius }),
      resetCustom: () => set({ customPrimary: null, customRadius: null }),
      setDensity: (density) => set({ density }),
      toggleSider: () =>
        set((state) => ({ siderCollapsed: !state.siderCollapsed })),
      setSiderCollapsed: (siderCollapsed) => set({ siderCollapsed }),
    }),
    { name: 'colony.preferences' },
  ),
);
