import { theme } from 'antd';

/**
 * Chart colours resolved from the live antd theme.
 *
 * Charts read from `useToken()` rather than CSS variables because Recharts
 * needs real values for things it computes in JS (gradient stops, tooltip
 * styling). Going through the token system means the whole chart set follows
 * the active preset and light/dark automatically — a chart hardcoding #1677ff
 * would stay blue while the rest of the app turned cinnabar.
 */
export function useChartTheme() {
  const { token } = theme.useToken();

  /**
   * Categorical series colours.
   *
   * The primary leads so single-series charts match the app accent; the rest
   * are spaced around the wheel for separability rather than being tints of
   * the primary, which collapse into each other at small sizes.
   */
  const series = [
    token.colorPrimary,
    token.green6,
    token.gold6,
    token.magenta6,
    token.cyan6,
    token.purple6,
  ];

  return {
    series,
    /**
     * Index-safe series colour. `noUncheckedIndexedAccess` makes `series[i]`
     * `string | undefined`, which every chart prop then rejects — wrapping the
     * modulo here keeps the strict flag on without a cast at each call site.
     */
    seriesColor: (i: number): string => series[i % series.length]!,
    primary: token.colorPrimary,
    grid: token.colorBorderSecondary,
    axis: token.colorTextTertiary,
    text: token.colorText,
    surface: token.colorBgElevated,

    /** Shared <Tooltip /> chrome so every chart's tooltip matches antd. */
    tooltip: {
      contentStyle: {
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        color: token.colorText,
        fontSize: token.fontSizeSM,
        padding: '8px 12px',
      },
      labelStyle: { color: token.colorTextSecondary, marginBottom: 4 },
      itemStyle: { color: token.colorText },
      cursor: { fill: token.colorFillTertiary },
    },

    axisProps: {
      stroke: token.colorBorderSecondary,
      tick: { fill: token.colorTextTertiary, fontSize: 11 },
      tickLine: false,
      axisLine: false,
    },
  } as const;
}
