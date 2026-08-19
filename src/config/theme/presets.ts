/**
 * Colony theme presets.
 *
 * Each preset is a small set of seed values — antd v6 derives the full palette
 * from them. Keeping presets this thin is what makes Theme Studio (Phase 2)
 * tractable: the editor mutates a `ThemePreset`, not a sprawl of overrides.
 */

export type ThemePresetId =
  'azure' | 'slate' | 'jade' | 'violet' | 'cinnabar' | 'contrast';

export interface ThemePreset {
  id: ThemePresetId;
  /** i18n key under `theme.preset.*` — never a hardcoded display string. */
  labelKey: string;
  colorPrimary: string;
  /** Primary tuned for dark grounds; the light value rarely survives inversion. */
  colorPrimaryDark: string;
  borderRadius: number;
}

export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: 'azure',
    labelKey: 'theme.preset.azure',
    colorPrimary: '#1677ff',
    colorPrimaryDark: '#3c8bff',
    borderRadius: 6,
  },
  {
    id: 'slate',
    labelKey: 'theme.preset.slate',
    colorPrimary: '#3a4b5c',
    colorPrimaryDark: '#8aa2b8',
    borderRadius: 6,
  },
  {
    id: 'jade',
    labelKey: 'theme.preset.jade',
    colorPrimary: '#2f7d62',
    colorPrimaryDark: '#4ea183',
    borderRadius: 8,
  },
  {
    id: 'violet',
    labelKey: 'theme.preset.violet',
    colorPrimary: '#6d4ac4',
    colorPrimaryDark: '#9878e0',
    borderRadius: 8,
  },
  {
    id: 'cinnabar',
    labelKey: 'theme.preset.cinnabar',
    colorPrimary: '#c63a28',
    colorPrimaryDark: '#e0705c',
    borderRadius: 6,
  },
  {
    id: 'contrast',
    labelKey: 'theme.preset.contrast',
    colorPrimary: '#0b5fff',
    colorPrimaryDark: '#7fb2ff',
    borderRadius: 4,
  },
] as const;

export const DEFAULT_PRESET_ID: ThemePresetId = 'azure';

export function getPreset(id: ThemePresetId): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0]!;
}
