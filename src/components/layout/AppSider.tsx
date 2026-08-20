import {
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  FormOutlined,
  ProfileOutlined,
  RobotOutlined,
  SettingOutlined,
  TableOutlined,
  WarningOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { usePreferences } from '@/stores/preferences';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export function AppSider() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = usePreferences((s) => s.siderCollapsed);

  /**
   * Menu labels are i18n keys resolved at render, never captured in a module
   * constant — a module-level array would freeze the English strings and
   * silently ignore a locale switch.
   */
  const items = useMemo<MenuItem[]>(
    () => [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: t('nav.dashboard'),
        children: [
          {
            key: '/dashboard/analysis',
            icon: <BarChartOutlined />,
            label: t('nav.analysis'),
          },
          { key: '/dashboard/monitor', label: t('nav.monitor') },
          { key: '/dashboard/workplace', label: t('nav.workplace') },
        ],
      },
      {
        key: '/components',
        icon: <AppstoreOutlined />,
        label: t('nav.components'),
        children: [
          { key: '/components/elements', label: t('nav.elements') },
          { key: '/components/cards', label: t('nav.cards') },
          { key: '/components/feedback', label: t('nav.feedback') },
        ],
      },
      {
        key: '/form',
        icon: <FormOutlined />,
        label: t('nav.forms'),
        children: [
          { key: '/form/basic', label: t('nav.basicForm') },
          { key: '/form/step', label: t('nav.stepForm') },
          { key: '/form/advanced', label: t('nav.advancedForm') },
        ],
      },
      {
        key: '/list',
        icon: <UnorderedListOutlined />,
        label: t('nav.lists'),
        children: [
          { key: '/list/basic', label: t('nav.basicList') },
          { key: '/list/card', label: t('nav.cardList') },
          { key: '/list/search', label: t('nav.searchList') },
        ],
      },
      { key: '/table', icon: <TableOutlined />, label: t('nav.table') },
      {
        key: '/profile',
        icon: <ProfileOutlined />,
        label: t('nav.profile'),
        children: [
          { key: '/profile/basic', label: t('nav.profileBasic') },
          { key: '/profile/advanced', label: t('nav.profileAdvanced') },
        ],
      },
      {
        key: '/account',
        icon: <SettingOutlined />,
        label: t('nav.account'),
        children: [
          { key: '/account/center', label: t('nav.accountCenter') },
          { key: '/account/settings', label: t('nav.settings') },
        ],
      },
      {
        key: '/ai/assistant',
        icon: <RobotOutlined />,
        label: t('nav.assistant'),
      },
      {
        key: '/exception',
        icon: <WarningOutlined />,
        label: t('nav.exceptions'),
        children: [
          { key: '/403', label: '403' },
          { key: '/500', label: '500' },
          { key: '/not-found', label: '404' },
        ],
      },
      {
        key: '/auth',
        icon: <UserOutlined />,
        label: t('nav.auth'),
        children: [
          { key: '/auth/login', label: t('auth.signIn') },
          { key: '/auth/register', label: t('auth.signUp') },
        ],
      },
    ],
    [t],
  );

  /** Longest matching prefix wins, so /dashboard/analysis beats /dashboard. */
  const selectedKeys = useMemo(() => {
    const path = location.pathname;
    const flat = [
      '/dashboard/analysis',
      '/dashboard/monitor',
      '/dashboard/workplace',
      '/components/elements',
      '/components/cards',
      '/components/feedback',
      '/form/basic',
      '/form/step',
      '/form/advanced',
      '/list/basic',
      '/list/card',
      '/list/search',
      '/profile/basic',
      '/profile/advanced',
      '/account/center',
      '/account/center',
      '/account/settings',
      '/ai/assistant',
      '/table',
      '/403',
      '/500',
      '/auth/login',
      '/auth/register',
    ];
    const match = flat
      .filter((k) => path === k || path.startsWith(`${k}/`))
      .sort((a, b) => b.length - a.length)[0];
    return match ? [match] : [];
  }, [location.pathname]);

  return (
    <Sider
      width="var(--layout-sider-w)"
      collapsedWidth="var(--layout-sider-collapsed-w)"
      collapsed={collapsed}
      theme="light"
      style={{
        borderInlineEnd: '1px solid var(--c-border)',
        position: 'sticky',
        top: 0,
        height: '100dvh',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: 'var(--layout-header-h)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '0 var(--space-4)',
          borderBottom: '1px solid var(--c-border-soft)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            flexShrink: 0,
            borderRadius: 'var(--radius-md)',
            background: 'var(--ant-color-primary)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          蚁
        </span>
        {!collapsed && (
          <strong
            style={{ fontSize: 'var(--text-md)', letterSpacing: '-0.01em' }}
          >
            {t('app.name')}
          </strong>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={collapsed ? [] : ['/dashboard', '/components']}
        items={items}
        style={{ borderInlineEnd: 0, paddingBlock: 'var(--space-2)' }}
        onClick={({ key }) => void navigate(key)}
      />
    </Sider>
  );
}
