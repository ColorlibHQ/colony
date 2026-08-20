import { describe, expect, it } from 'vitest';

import { contrastRatio, luminance, parseHex, wcagLevel } from './contrast';

describe('parseHex', () => {
  it('accepts long, short and 8-digit hex', () => {
    expect(parseHex('#1677ff')).toEqual([22, 119, 255]);
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('1677ffcc')).toEqual([22, 119, 255]);
  });

  it('rejects anything that is not a colour', () => {
    expect(parseHex('rebeccapurple')).toBeNull();
    expect(parseHex('#12')).toBeNull();
    expect(parseHex('')).toBeNull();
  });
});

describe('contrastRatio', () => {
  /** The two anchors WCAG itself defines, so the maths is pinned, not guessed. */
  it('is 21 for black on white and 1 for a colour on itself', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#1677ff', '#1677ff')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#1677ff', '#ffffff')).toBeCloseTo(
      contrastRatio('#ffffff', '#1677ff'),
      10,
    );
  });

  it('reports antd default blue on white below AA for body text', () => {
    // 3.68:1 — fine for large text and UI boundaries, not for body copy.
    const r = contrastRatio('#1677ff', '#ffffff');
    expect(r).toBeGreaterThan(3);
    expect(r).toBeLessThan(4.5);
  });
});

describe('luminance', () => {
  it('runs from 0 for black to 1 for white', () => {
    expect(luminance('#000000')).toBeCloseTo(0, 5);
    expect(luminance('#ffffff')).toBeCloseTo(1, 5);
  });
});

describe('wcagLevel', () => {
  it.each([
    [21, 'aaa'],
    [7, 'aaa'],
    [6.99, 'aa'],
    [4.5, 'aa'],
    [4.49, 'aaLarge'],
    [3, 'aaLarge'],
    [2.99, 'fail'],
    [1, 'fail'],
  ])('grades %s as %s', (ratio, level) => {
    expect(wcagLevel(ratio)).toBe(level);
  });
});
