import { Layout } from 'antd';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSider } from '@/components/layout/AppSider';
import { PageLoader } from '@/components/common/PageLoader';
import { CommandPalette } from '@/components/command/CommandPalette';

const { Content } = Layout;

export function AppLayout() {
  const { t } = useTranslation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  /**
   * Cmd+K on macOS, Ctrl+K elsewhere. Bound on the window so it works wherever
   * focus happens to be, and suppressed while a text field has focus only for
   * the plain "/" alias — Cmd+K is unambiguous and should always open.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      <a className="skip-link" href="#main">
        {t('a11y.skipToContent')}
      </a>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />

      <AppSider />

      <Layout>
        <AppHeader onOpenPalette={() => setPaletteOpen(true)} />
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
