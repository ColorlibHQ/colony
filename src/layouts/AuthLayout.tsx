import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { SUPPORTED_LOCALES, changeLocale, isSupportedLocale } from '@/i18n';

/**
 * Shell for signed-out screens.
 *
 * Split panel on wide viewports, single column below — the marketing half is
 * the first thing to go, since it is the part a person signing in does not
 * need. The locale switch stays available: someone who cannot read the form
 * cannot sign in to change the setting later.
 */
export function AuthLayout() {
  const { t, i18n } = useTranslation();

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        background: 'var(--c-bg)',
      }}
    >
      <div className="auth-grid">
        {/* Marketing panel */}
        <aside className="auth-aside">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-10)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--ant-color-primary)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              蚁
            </span>
            <strong style={{ fontSize: 'var(--text-lg)' }}>
              {t('app.name')}
            </strong>
          </div>

          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-4)',
              maxWidth: '18ch',
            }}
          >
            {t('auth.heroTitle')}
          </h2>
          <p
            style={{
              color: 'var(--c-text-secondary)',
              maxWidth: '42ch',
              marginBottom: 'var(--space-8)',
            }}
          >
            {t('auth.heroBody')}
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {['noLockIn', 'bilingual', 'themed'].map((k) => (
              <li key={k} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <span
                  aria-hidden="true"
                  style={{ color: 'var(--ant-color-primary)' }}
                >
                  —
                </span>
                <span style={{ color: 'var(--c-text-secondary)' }}>
                  {t(`auth.point.${k}`)}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Form panel */}
        <main className="auth-main">
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: SUPPORTED_LOCALES.map((c) => ({
                  key: c,
                  label: t(`locale.${c}`),
                })),
                selectable: true,
                selectedKeys: [i18n.language],
                onClick: ({ key }) => {
                  if (isSupportedLocale(key)) void changeLocale(key);
                },
              }}
            >
              <Button
                type="text"
                aria-label={t('locale.label')}
                icon={<GlobalOutlined />}
              />
            </Dropdown>
          </div>
          <div style={{ width: '100%', maxWidth: 380 }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .auth-grid { display: grid; grid-template-columns: 1fr; min-height: 100dvh; }
        .auth-aside { display: none; }
        .auth-main {
          position: relative;
          display: grid;
          place-items: center;
          padding: var(--space-6);
          background: var(--c-surface);
        }
        @media (min-width: 960px) {
          .auth-grid { grid-template-columns: 1.1fr 1fr; }
          .auth-aside {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: var(--space-16);
            background: var(--c-bg);
            border-inline-end: 1px solid var(--c-border);
          }
        }
      `}</style>
    </div>
  );
}
