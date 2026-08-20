import { App as AntdApp, ConfigProvider } from 'antd';
import enUSAntd from 'antd/locale/en_US';
import zhCNAntd from 'antd/locale/zh_CN';
import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

import { buildTheme } from '@/config/theme';
import { isCjkLocale } from '@/i18n';
import { usePreferences } from '@/stores/preferences';

import 'dayjs/locale/zh-cn';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Subscribe to the OS colour preference.
 *
 * useSyncExternalStore rather than an effect + state: this value is read during
 * render to pick the antd algorithm, and an effect would render one frame in
 * the wrong theme.
 */
function subscribeToSystemDark(onChange: () => void): () => void {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSystemDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

/** Server/SSR-less fallback — the demo is a SPA, but keep the API honest. */
function getSystemDarkServer(): boolean {
  return false;
}

const ANTD_LOCALES = {
  'en-US': enUSAntd,
  'zh-CN': zhCNAntd,
} as const;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const colorMode = usePreferences((s) => s.colorMode);
  const presetId = usePreferences((s) => s.presetId);
  const density = usePreferences((s) => s.density);
  const customPrimary = usePreferences((s) => s.customPrimary);
  const customRadius = usePreferences((s) => s.customRadius);

  const systemDark = useSyncExternalStore(
    subscribeToSystemDark,
    getSystemDark,
    getSystemDarkServer,
  );

  const isDark = colorMode === 'system' ? systemDark : colorMode === 'dark';
  const isCjk = isCjkLocale(i18n.language);

  /**
   * Stamp the resolved theme on <html>.
   *
   * 'system' removes the attribute entirely rather than writing the resolved
   * value — that keeps the CSS `prefers-color-scheme` path authoritative and
   * matches the three-state contract in tokens.css.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', colorMode);
    }
  }, [colorMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  const themeConfig = useMemo(
    () =>
      buildTheme({
        presetId,
        isDark,
        density,
        isCjk,
        customPrimary,
        customRadius,
      }),
    [presetId, isDark, density, isCjk, customPrimary, customRadius],
  );

  const antdLocale =
    ANTD_LOCALES[i18n.language as keyof typeof ANTD_LOCALES] ?? enUSAntd;

  return (
    <ConfigProvider theme={themeConfig} locale={antdLocale}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
