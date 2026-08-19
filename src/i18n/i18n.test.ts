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
    const get = (o: Json, p: string): string =>
      p
        .split('.')
        .reduce<Json | string>((a, k) => (a as Json)[k]!, o) as string;

    for (const key of flatten(enUS)) {
      if (exempt.has(key)) continue;
      const en = get(enUS, key);
      const zh = get(zhCN, key);
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
