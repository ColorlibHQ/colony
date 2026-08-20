import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

import { getPreset, type ThemePresetId } from './presets';

export * from './presets';

export type ColorMode = 'light' | 'dark' | 'system';
export type Density = 'comfortable' | 'compact' | 'condensed';

/** Font stacks mirror src/styles/tokens.css — antd needs them explicitly. */
const FONT_LATIN =
  "'Inter var', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const FONT_CJK =
  "'Noto Sans SC', 'Source Han Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

/**
 * Build the antd v6 ThemeConfig.
 *
 * `isDark` is the *resolved* mode — callers pass the outcome of the system
 * query, not the raw 'system' preference, so this stays a pure function.
 *
 * `isCjk` swaps the font stack order and relaxes line-height: Han glyphs need
 * more leading than Latin at the same size, and antd's default 1.5714 crushes
 * them. This is the same split as the CSS `:lang()` block.
 */
export function buildTheme(options: {
  presetId: ThemePresetId;
  isDark: boolean;
  density: Density;
  isCjk: boolean;
  /** Theme Studio overrides; null falls back to the preset. */
  customPrimary?: string | null;
  customRadius?: number | null;
}): ThemeConfig {
  const { presetId, isDark, density, isCjk } = options;
  const preset = getPreset(presetId);
  const primary =
    options.customPrimary ??
    (isDark ? preset.colorPrimaryDark : preset.colorPrimary);
  const borderRadius = options.customRadius ?? preset.borderRadius;

  const algorithms = [
    isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  ];
  if (density !== 'comfortable') {
    algorithms.push(antdTheme.compactAlgorithm);
  }

  return {
    algorithm: algorithms,
    token: {
      colorPrimary: primary,
      borderRadius,

      fontFamily: isCjk
        ? `${FONT_CJK}, ${FONT_LATIN}`
        : `${FONT_LATIN}, ${FONT_CJK}`,
      fontSize: density === 'condensed' ? 13 : isCjk ? 15 : 14,
      lineHeight: isCjk ? 1.75 : 1.5714,

      // Semantic colors are state, never decoration — these match tokens.css.
      colorSuccess: isDark ? '#62b593' : '#2f7d62',
      colorWarning: isDark ? '#cfa45c' : '#a97620',
      colorError: isDark ? '#e9705c' : '#c63a28',

      motionDurationMid: '0.18s',
      motionEaseOut: 'cubic-bezier(0.22, 0.61, 0.36, 1)',

      boxShadowSecondary: isDark
        ? '0 1px 2px rgb(0 0 0 / 40%), 0 6px 16px -8px rgb(0 0 0 / 60%)'
        : '0 1px 2px rgb(28 34 48 / 5%), 0 6px 16px -8px rgb(28 34 48 / 14%)',
    },
    components: {
      Layout: {
        // Driven by our own tokens so the shell and antd never disagree.
        bodyBg: 'var(--c-bg)',
        headerBg: 'var(--c-surface)',
        siderBg: 'var(--c-surface)',
        headerHeight: 60,
        headerPadding: '0 16px',
      },
      Menu: {
        itemBorderRadius: borderRadius,
        itemMarginInline: 8,
        activeBarWidth: 0,
      },
      Card: {
        borderRadiusLG: Math.max(borderRadius + 4, 8),
      },
      Progress: {
        defaultColor: primary,
      },
      Table: {
        headerBg: 'var(--c-surface-sunken)',
        headerSplitColor: 'transparent',
        borderColor: 'var(--c-border-soft)',
      },
    },
  };
}
