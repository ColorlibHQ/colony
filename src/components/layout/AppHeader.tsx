import {
  BgColorsOutlined,
  ColumnHeightOutlined,
  DesktopOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SearchOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Layout, Space, Tag, Tooltip } from 'antd';
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
import { matchNav } from '@/config/navigation';
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

export function AppHeader({ onOpenPalette }: { onOpenPalette: () => void }) {
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

  /**
   * Derived from the shared NAVIGATION tree. A hand-kept segment->label map
   * lived here and fell out of date twice, printing raw lowercase route
   * segments until someone noticed.
   */
  const trail = matchNav(location.pathname);
  const crumbs = trail.map((node, i) => ({
    key: node.key,
    title:
      i === trail.length - 1 ? (
        t(node.labelKey)
      ) : (
        <Link to={node.key}>{t(node.labelKey)}</Link>
      ),
  }));

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

      {/* A shortcut nobody can discover is not a feature — show the trigger. */}
      <Button
        onClick={onOpenPalette}
        aria-label={t('a11y.openCommandPalette')}
        icon={<SearchOutlined />}
        style={{ color: 'var(--c-text-tertiary)' }}
      >
        <span className="palette-hint">{t('palette.trigger')}</span>
        <Tag style={{ marginInlineStart: 4, fontFamily: 'var(--font-mono)' }}>
          ⌘K
        </Tag>
      </Button>

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
