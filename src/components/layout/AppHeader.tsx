import {
  BgColorsOutlined,
  ColumnHeightOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Space, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { THEME_PRESETS, type ColorMode, type Density } from '@/config/theme';
import { SUPPORTED_LOCALES, isSupportedLocale } from '@/i18n';
import { usePreferences } from '@/stores/preferences';

const { Header } = Layout;

const COLOR_MODES: ColorMode[] = ['light', 'dark', 'system'];
const DENSITIES: Density[] = ['comfortable', 'compact', 'condensed'];

export function AppHeader() {
  const { t, i18n } = useTranslation();
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

  const localeItems: MenuProps['items'] = SUPPORTED_LOCALES.map((code) => ({
    key: code,
    label: t(`locale.${code}`),
  }));

  const modeItems: MenuProps['items'] = COLOR_MODES.map((mode) => ({
    key: mode,
    label: t(`theme.mode.${mode}`),
  }));

  const presetItems: MenuProps['items'] = THEME_PRESETS.map((preset) => ({
    key: preset.id,
    label: (
      <Space>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 3,
            background: preset.colorPrimary,
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
        gap: 'var(--space-2)',
        height: 'var(--layout-header-h)',
        lineHeight: 'var(--layout-header-h)',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      <Button
        type="text"
        aria-label={t('a11y.toggleSidebar')}
        icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleSider}
      />

      <div style={{ flex: 1 }} />

      <Space size={4}>
        <Dropdown
          menu={{
            items: presetItems,
            selectable: true,
            selectedKeys: [presetId],
            onClick: ({ key }) => setPresetId(key as never),
          }}
          trigger={['click']}
        >
          <Tooltip title={t('theme.preset.label')}>
            <Button
              type="text"
              aria-label={t('theme.preset.label')}
              icon={<BgColorsOutlined />}
            />
          </Tooltip>
        </Dropdown>

        <Dropdown
          menu={{
            items: densityItems,
            selectable: true,
            selectedKeys: [density],
            onClick: ({ key }) => setDensity(key as Density),
          }}
          trigger={['click']}
        >
          <Tooltip title={t('theme.density.label')}>
            <Button
              type="text"
              aria-label={t('theme.density.label')}
              icon={<ColumnHeightOutlined />}
            />
          </Tooltip>
        </Dropdown>

        <Dropdown
          menu={{
            items: modeItems,
            selectable: true,
            selectedKeys: [colorMode],
            onClick: ({ key }) => setColorMode(key as ColorMode),
          }}
          trigger={['click']}
        >
          <Tooltip title={t('theme.label')}>
            <Button
              type="text"
              aria-label={t('theme.label')}
              icon={colorMode === 'dark' ? <MoonOutlined /> : <SunOutlined />}
            />
          </Tooltip>
        </Dropdown>

        <Dropdown
          menu={{
            items: localeItems,
            selectable: true,
            selectedKeys: [i18n.language],
            onClick: ({ key }) => {
              if (isSupportedLocale(key)) void i18n.changeLanguage(key);
            },
          }}
          trigger={['click']}
        >
          <Tooltip title={t('locale.label')}>
            <Button
              type="text"
              aria-label={t('locale.label')}
              icon={<GlobalOutlined />}
            />
          </Tooltip>
        </Dropdown>
      </Space>
    </Header>
  );
}
