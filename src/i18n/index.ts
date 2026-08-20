import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

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

/**
 * Translation bundles are loaded on demand rather than imported statically.
 *
 * Static imports put every locale in the entry chunk, so a reader in Shanghai
 * downloads the English copy they will never see, and vice versa. Each bundle
 * is its own chunk; only the active one is fetched, and a locale switch fetches
 * the other exactly once.
 */
const LOADERS: Record<Locale, () => Promise<{ default: object }>> = {
  'en-US': () => import('./locales/en-US/common.json'),
  'zh-CN': () => import('./locales/zh-CN/common.json'),
};

const loaded = new Set<string>();

async function loadLocale(locale: string): Promise<void> {
  if (!isSupportedLocale(locale) || loaded.has(locale)) return;
  const mod = await LOADERS[locale]();
  i18n.addResourceBundle(locale, 'common', mod.default, true, true);
  loaded.add(locale);
}

function detectInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isSupportedLocale(stored)) return stored;
  const nav = navigator.language;
  if (isSupportedLocale(nav)) return nav;
  // zh, zh-Hans, zh-SG … all read as Simplified Chinese here.
  if (nav.startsWith('zh')) return 'zh-CN';
  return DEFAULT_LOCALE;
}

/**
 * Must be awaited before the first render. Rendering ahead of the bundle would
 * paint raw i18n keys for a frame — worse on a slow connection, where that
 * frame is what a first-time visitor actually sees.
 */
export async function initI18n(): Promise<void> {
  const initial = detectInitialLocale();

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: initial,
      resources: {},
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: [...SUPPORTED_LOCALES],
      defaultNS: 'common',
      ns: ['common'],
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: STORAGE_KEY,
        caches: ['localStorage'],
      },
      // React already escapes.
      interpolation: { escapeValue: false },
      returnNull: false,
    });

  await loadLocale(initial);
  applyDocumentLocale(initial);

  i18n.on('languageChanged', (lng) => {
    applyDocumentLocale(lng);
    void loadLocale(lng);
  });
}

/**
 * Switch locale safely: fetch the bundle first, then flip. Calling
 * i18n.changeLanguage directly would swap the active language before its
 * strings exist and paint raw keys for a frame.
 */
export async function changeLocale(locale: Locale): Promise<void> {
  await loadLocale(locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
