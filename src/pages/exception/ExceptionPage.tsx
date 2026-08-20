import { Button, Result, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { ExceptionArt } from '@/components/common/ExceptionArt';

interface ExceptionPageProps {
  code: '403' | '404' | '500';
}

export function ExceptionPage({ code }: ExceptionPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // RequirePermission carries the refused path so the wall can name it.
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <Result
      icon={<ExceptionArt code={code} />}
      title={code}
      subTitle={
        code === '403' && from
          ? t('exception.403from', { path: from })
          : t(`exception.${code}`)
      }
      extra={
        <Space>
          <Button onClick={() => void navigate(-1)}>{t('action.back')}</Button>
          <Button type="primary" onClick={() => void navigate('/')}>
            {t('exception.goHome')}
          </Button>
        </Space>
      }
    />
  );
}
