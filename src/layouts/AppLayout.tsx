import { Layout } from 'antd';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSider } from '@/components/layout/AppSider';
import { PageLoader } from '@/components/common/PageLoader';

const { Content } = Layout;

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      <a className="skip-link" href="#main">
        {t('a11y.skipToContent')}
      </a>

      <AppSider />

      <Layout>
        <AppHeader />
        <Content
          id="main"
          tabIndex={-1}
          style={{
            padding: 'var(--space-6)',
            maxWidth: 'var(--layout-content-max)',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
