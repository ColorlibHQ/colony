import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enUS from './locales/en-US/common.json';
import zhCN from './locales/zh-CN/common.json';

export const SUPPORTED_LOCALES = ['en-US', 'zh-CN'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en-US';
export const STORAGE_KEY = 'colony.locale';

/** Locales whose typography needs the CJK metric set (see tokens.css). */
const CJK_LOCALES = new Set<string>(['zh-CN', 'zh-TW', 'ja-JP', 'ko-KR']);

export function isCjkLocale(locale: string): boolean {
  return CJK_LOCALES.has(locale);
}

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Reflect the active locale onto <html>.
 *
 * `lang` is doing real work here, not just semantics: tokens.css keys its CJK
 * type scale off `:root:lang(zh)`, so this single attribute swaps line-height,
 * letter-spacing and the font stack for the whole document.
 */
export function applyDocumentLocale(locale: string): void {
  document.documentElement.lang = locale;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { common: enUS },
      'zh-CN': { common: zhCN },
    },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    defaultNS: 'common',
    ns: ['common'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      // React already escapes.
      escapeValue: false,
    },
    returnNull: false,
  });

i18n.on('languageChanged', (lng) => {
  applyDocumentLocale(lng);
});

applyDocumentLocale(i18n.language || DEFAULT_LOCALE);

export default i18n;
