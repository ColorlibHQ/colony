import { describe, expect, it } from 'vitest';

import { buildTheme, getPreset, THEME_PRESETS } from './index';

describe('theme presets', () => {
  it('exposes a distinct primary for light and dark on every preset', () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.colorPrimary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(preset.colorPrimaryDark).toMatch(/^#[0-9a-f]{6}$/i);
      // A light primary reused on a dark ground is the classic contrast bug.
      expect(preset.colorPrimaryDark).not.toBe(preset.colorPrimary);
    }
  });

  it('has unique preset ids', () => {
    const ids = THEME_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('falls back to the first preset for an unknown id', () => {
    expect(getPreset('nope' as never)).toBe(THEME_PRESETS[0]);
  });
});

describe('buildTheme', () => {
  const base = {
    presetId: 'azure',
    density: 'comfortable',
    isCjk: false,
  } as const;

  it('picks the dark primary when dark is resolved', () => {
    const light = buildTheme({ ...base, isDark: false });
    const dark = buildTheme({ ...base, isDark: true });
    expect(light.token?.colorPrimary).toBe('#1677ff');
    expect(dark.token?.colorPrimary).toBe('#3c8bff');
  });

  it('applies the compact algorithm only outside comfortable density', () => {
    const comfortable = buildTheme({ ...base, isDark: false });
    const compact = buildTheme({ ...base, isDark: false, density: 'compact' });
    expect(
      Array.isArray(comfortable.algorithm) && comfortable.algorithm,
    ).toHaveLength(1);
    expect(Array.isArray(compact.algorithm) && compact.algorithm).toHaveLength(
      2,
    );
  });

  it('leads with the CJK font stack and relaxes leading for Chinese', () => {
    const latin = buildTheme({ ...base, isDark: false, isCjk: false });
    const cjk = buildTheme({ ...base, isDark: false, isCjk: true });

    expect(latin.token?.fontFamily).toMatch(/^'Inter var'/);
    expect(cjk.token?.fontFamily).toMatch(/^'Noto Sans SC'/);

    // Han glyphs need more leading and more size than Latin at parity.
    expect(cjk.token?.lineHeight).toBeGreaterThan(
      latin.token!.lineHeight as number,
    );
    expect(cjk.token?.fontSize).toBeGreaterThan(
      latin.token!.fontSize as number,
    );
  });
});
