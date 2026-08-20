import {
  AppstoreOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  FormOutlined,
  ProfileOutlined,
  RobotOutlined,
  SettingOutlined,
  TableOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { NAVIGATION, activeNavKey, type NavNode } from '@/config/navigation';
import { usePreferences } from '@/stores/preferences';

const { Sider } = Layout;

/** Icons stay in the view layer; navigation.ts only names them. */
const ICONS: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  chart: <BarChartOutlined />,
  appstore: <AppstoreOutlined />,
  form: <FormOutlined />,
  list: <UnorderedListOutlined />,
  table: <TableOutlined />,
  profile: <ProfileOutlined />,
  settings: <SettingOutlined />,
  robot: <RobotOutlined />,
  palette: <BgColorsOutlined />,
  warning: <WarningOutlined />,
  user: <UserOutlined />,
};

export function AppSider() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = usePreferences((s) => s.siderCollapsed);

  /**
   * Built from the shared NAVIGATION tree rather than a local copy, so the
   * sidebar, breadcrumb and command palette cannot drift apart. Labels resolve
   * at render — a module-level array would freeze the English strings.
   */
  const items = useMemo<MenuProps['items']>(() => {
    const toItem = (
      node: NavNode,
    ): NonNullable<MenuProps['items']>[number] => ({
      key: node.key,
      icon: node.icon ? ICONS[node.icon] : undefined,
      label: t(node.labelKey),
      children: node.children?.map(toItem),
    });
    return NAVIGATION.filter((n) => !n.hidden).map(toItem);
  }, [t]);

  const selectedKeys = useMemo(() => {
    const key = activeNavKey(location.pathname);
    return key ? [key] : [];
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
