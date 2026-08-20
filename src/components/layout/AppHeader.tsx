import {
  BgColorsOutlined,
  ColumnHeightOutlined,
  DesktopOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Layout, Space, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import {
  THEME_PRESETS,
  type ColorMode,
  type Density,
  type ThemePresetId,
} from '@/config/theme';
import { SUPPORTED_LOCALES, changeLocale, isSupportedLocale } from '@/i18n';
import { usePreferences } from '@/stores/preferences';

import { HeaderAction } from './HeaderAction';

const { Header } = Layout;

const COLOR_MODES: ColorMode[] = ['light', 'dark', 'system'];
const DENSITIES: Density[] = ['comfortable', 'compact', 'condensed'];

const MODE_ICON: Record<ColorMode, ReturnType<typeof SunOutlined>> = {
  light: <SunOutlined />,
  dark: <MoonOutlined />,
  system: <DesktopOutlined />,
};

/** Route segment -> i18n key, for the breadcrumb trail. */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'nav.dashboard',
  analysis: 'nav.analysis',
  monitor: 'nav.monitor',
  workplace: 'nav.workplace',
  table: 'nav.table',
  form: 'nav.forms',
  list: 'nav.lists',
  profile: 'nav.profile',
  account: 'nav.account',
  components: 'nav.components',
  elements: 'nav.elements',
  cards: 'nav.cards',
  feedback: 'nav.feedback',
  basic: 'nav.basicForm',
  card: 'nav.cardList',
  step: 'nav.stepForm',
  advanced: 'nav.advancedForm',
  search: 'nav.searchList',
  center: 'nav.accountCenter',
  settings: 'nav.settings',
  ai: 'nav.assistant',
  assistant: 'nav.assistant',
  'theme-studio': 'nav.themeStudio',
};

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const {
    siderCollapsed,
    toggleSider,
    colorMode,
    setColorMode,
    presetId,
    setPresetId,
    density,
    setDensity,
  } = usePreferences();

  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = `/${segments.slice(0, i + 1).join('/')}`;
    const key = SEGMENT_LABELS[seg];
    const title = key ? t(key) : seg;
    return {
      key: href,
      title: i === segments.length - 1 ? title : <Link to={href}>{title}</Link>,
    };
  });

  const localeItems: MenuProps['items'] = SUPPORTED_LOCALES.map((code) => ({
    key: code,
    label: t(`locale.${code}`),
  }));

  const modeItems: MenuProps['items'] = COLOR_MODES.map((mode) => ({
    key: mode,
    icon: MODE_ICON[mode],
    label: t(`theme.mode.${mode}`),
  }));

  const presetItems: MenuProps['items'] = THEME_PRESETS.map((preset) => ({
    key: preset.id,
    label: (
      <Space size={8}>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 3,
            background: preset.colorPrimary,
            boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 12%)',
          }}
        />
        {t(preset.labelKey)}
      </Space>
    ),
  }));

  const densityItems: MenuProps['items'] = DENSITIES.map((d) => ({
    key: d,
    label: t(`theme.density.${d}`),
  }));

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        height: 'var(--layout-header-h)',
        lineHeight: 'var(--layout-header-h)',
        paddingInline: 'var(--space-4)',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      <Tooltip title={t('a11y.toggleSidebar')} placement="bottomLeft">
        <Button
          type="text"
          aria-label={t('a11y.toggleSidebar')}
          aria-expanded={!siderCollapsed}
          icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSider}
        />
      </Tooltip>

      {crumbs.length > 0 && (
        <Breadcrumb items={crumbs} style={{ lineHeight: 'normal' }} />
      )}

      <div style={{ flex: 1 }} />

      <Space size={2}>
        <HeaderAction
          label={t('theme.preset.label')}
          icon={<BgColorsOutlined />}
          items={presetItems}
          selectedKeys={[presetId]}
          onSelect={(key) => setPresetId(key as ThemePresetId)}
        />
        <HeaderAction
          label={t('theme.density.label')}
          icon={<ColumnHeightOutlined />}
          items={densityItems}
          selectedKeys={[density]}
          onSelect={(key) => setDensity(key as Density)}
        />
        <HeaderAction
          label={t('theme.label')}
          icon={MODE_ICON[colorMode]}
          items={modeItems}
          selectedKeys={[colorMode]}
          onSelect={(key) => setColorMode(key as ColorMode)}
        />
        <HeaderAction
          label={t('locale.label')}
          icon={<GlobalOutlined />}
          items={localeItems}
          selectedKeys={[i18n.language]}
          onSelect={(key) => {
            if (isSupportedLocale(key)) void changeLocale(key);
          }}
        />
        <Avatar
          size={30}
          style={{
            marginInlineStart: 'var(--space-2)',
            background: 'var(--ant-color-primary)',
            flexShrink: 0,
          }}
        >
          A
        </Avatar>
      </Space>
    </Header>
  );
}
