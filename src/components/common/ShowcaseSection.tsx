import { Card } from 'antd';
import type { ReactNode } from 'react';

interface ShowcaseSectionProps {
  title: string;
  description?: string;
  extra?: ReactNode;
  children: ReactNode;
}

/**
 * One labelled group in a gallery page.
 *
 * Gallery pages are scanned, not read — so each group carries its own heading
 * and a one-line description of when to reach for it, rather than leaving the
 * reader to infer intent from a wall of unlabelled controls.
 */
export function ShowcaseSection({
  title,
  description,
  extra,
  children,
}: ShowcaseSectionProps) {
  return (
    <Card
      title={title}
      extra={extra}
      style={{ marginBottom: 'var(--space-4)' }}
      styles={{ body: { padding: 'var(--space-5)' } }}
    >
      {description && (
        <p
          style={{
            marginTop: 0,
            marginBottom: 'var(--space-4)',
            color: 'var(--c-text-secondary)',
            fontSize: 'var(--text-sm)',
            maxWidth: '68ch',
          }}
        >
          {description}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </Card>
  );
}

/** Same as ShowcaseSection but stacks children instead of wrapping them inline. */
export function ShowcaseStack({
  title,
  description,
  children,
}: Omit<ShowcaseSectionProps, 'extra'>) {
  return (
    <Card
      title={title}
      style={{ marginBottom: 'var(--space-4)' }}
      styles={{ body: { padding: 'var(--space-5)' } }}
    >
      {description && (
        <p
          style={{
            marginTop: 0,
            marginBottom: 'var(--space-4)',
            color: 'var(--c-text-secondary)',
            fontSize: 'var(--text-sm)',
            maxWidth: '68ch',
          }}
        >
          {description}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {children}
      </div>
    </Card>
  );
}
