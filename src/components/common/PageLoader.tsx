import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

export function PageLoader() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 240,
        color: 'var(--c-text-tertiary)',
      }}
    >
      <Spin description={t('state.loading')} />
    </div>
  );
}
