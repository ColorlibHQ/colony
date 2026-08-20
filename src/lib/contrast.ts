/**
 * WCAG contrast maths.
 *
 * Theme Studio shows this next to the colour picker because a picker without a
 * contrast readout is how inaccessible themes get shipped: the value looks fine
 * to whoever chose it, and nothing on screen says otherwise until a user with
 * low vision cannot read the button.
 *
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */

export type WcagLevel = 'aaa' | 'aa' | 'aaLarge' | 'fail';

/** Parses #rgb, #rrggbb and #rrggbbaa. Alpha is ignored — contrast is measured
 *  against a composited surface, which the caller supplies. */
export function parseHex(hex: string): [number, number, number] | null {
  const s = hex.trim().replace(/^#/, '');
  const full =
    s.length === 3
      ? s
          .split('')
          .map((c) => c + c)
          .join('')
      : s.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Relative luminance, per WCAG 2.2. */
export function luminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colours, from 1 (identical) to 21 (black/white). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Thresholds are for the colour used as *text or a meaningful UI boundary*.
 * 4.5 is AA for body text, 3.0 is AA for large text and non-text UI, 7.0 is AAA.
 */
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'aaa';
  if (ratio >= 4.5) return 'aa';
  if (ratio >= 3) return 'aaLarge';
  return 'fail';
}
