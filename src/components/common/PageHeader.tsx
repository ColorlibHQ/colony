import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: ReactNode;
}

export function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-1)' }}
        >
          {title}
        </h1>
        {description ? (
          <p
            style={{
              margin: 0,
              color: 'var(--c-text-secondary)',
              maxWidth: '68ch',
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {extra ? <div style={{ flexShrink: 0 }}>{extra}</div> : null}
    </header>
  );
}
