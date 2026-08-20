import { describe, expect, it } from 'vitest';

import enUS from './locales/en-US/common.json';
import zhCN from './locales/zh-CN/common.json';
import { isCjkLocale, isSupportedLocale, SUPPORTED_LOCALES } from './index';

type Json = { [k: string]: string | Json };

function flatten(obj: Json, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('locale parity', () => {
  /**
   * The guard that keeps zh-CN a first-class locale rather than a stale
   * translation: an English key added without its Chinese pair fails CI.
   */
  it('zh-CN has every key en-US has, and no extras', () => {
    const en = flatten(enUS).sort();
    const zh = flatten(zhCN).sort();
    expect(zh).toEqual(en);
  });

  it('has no Latin-only values left in zh-CN', () => {
    /**
     * Differing from the English is not sufficient. `profile.technical` once
     * held "technical" against English "Technical contact" — different, and
     * still plainly untranslated. Chinese copy should contain Han characters
     * unless it is a brand name or a placeholder token.
     */
    const brands =
      /^(Ant Design|Design Token|React|GitHub|Google|Vite|TypeScript|MSW|English|简体中文)$/;
    /** Technical acronyms are written in Latin in Chinese copy too (CPU, API). */
    const acronym = /^[A-Z][A-Z0-9]{1,5}$/;
    /** Filenames and identifiers are code, not copy. */
    const identifier = /^[\w.-]+\.(ts|tsx|js|json|css|md|zip|csv)$/;
    const walk = (obj: Json, path = ''): void => {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'object') {
          walk(v, `${path}${k}.`);
          continue;
        }
        const stripped = v.replaceAll(/\{\{\w+\}\}/g, '').trim();
        if (
          !stripped ||
          brands.test(stripped) ||
          acronym.test(stripped) ||
          identifier.test(stripped)
        )
          continue;
        if (/[A-Za-z]/.test(stripped) && !/[\u4e00-\u9fff]/.test(stripped)) {
          expect
            .soft(stripped, `zh-CN ${path}${k} looks untranslated`)
            .toMatch(/[\u4e00-\u9fff]/);
        }
      }
    };
    walk(zhCN);
  });

  it('has no empty translation values', () => {
    const walk = (obj: Json, path = ''): void => {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'object') walk(v, `${path}${k}.`);
        else expect(v.trim(), `${path}${k} is empty`).not.toBe('');
      }
    };
    walk(enUS);
    walk(zhCN);
  });

  it('does not leave English strings untranslated in zh-CN', () => {
    // Locale display names are intentionally endonyms, so exempt them.
    const exempt = new Set(['locale.en-US', 'locale.zh-CN']);
    /**
     * Proper nouns stay in Latin script in Chinese copy — "Ant Design" and
     * "React" are what a Chinese developer actually writes and searches for.
     * Translating them would be wrong, so they are allowed to match, but the
     * list is explicit: anything NOT named here must differ between locales.
     */
    const brands = new Set([
      'Ant Design',
      'React',
      'GitHub',
      'Google',
      'Vite',
      'TypeScript',
      'MSW',
    ]);
    const get = (o: Json, p: string): string =>
      p
        .split('.')
        .reduce<Json | string>((a, k) => (a as Json)[k]!, o) as string;

    for (const key of flatten(enUS)) {
      if (exempt.has(key)) continue;
      const en = get(enUS, key);
      const zh = get(zhCN, key);
      if (brands.has(en)) continue;
      if (/^[A-Za-z ]+$/.test(en) && en.length > 3) {
        expect(zh, `${key} still reads as English`).not.toBe(en);
      }
    }
  });
});

describe('locale helpers', () => {
  it('recognises supported locales', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en-US', 'zh-CN']);
    expect(isSupportedLocale('zh-CN')).toBe(true);
    expect(isSupportedLocale('de-DE')).toBe(false);
  });

  it('flags CJK locales so typography can switch metrics', () => {
    expect(isCjkLocale('zh-CN')).toBe(true);
    expect(isCjkLocale('ja-JP')).toBe(true);
    expect(isCjkLocale('en-US')).toBe(false);
  });
});
