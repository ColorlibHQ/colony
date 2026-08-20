import { MailOutlined } from '@ant-design/icons';
import { Button, Result, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function RegisterResultPage() {
  const { t } = useTranslation();

  return (
    <Result
      icon={<MailOutlined style={{ color: 'var(--ant-color-primary)' }} />}
      title={t('auth.checkInbox')}
      subTitle={
        <Space direction="vertical" size={4}>
          <span>{t('auth.checkInboxDesc')}</span>
          <Typography.Text strong copyable>
            demo@colony.dev
          </Typography.Text>
        </Space>
      }
      extra={
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Button type="primary" block>
            {t('auth.resendEmail')}
          </Button>
          <Link to="/auth/login">{t('auth.backToSignIn')}</Link>
        </Space>
      }
    />
  );
}
