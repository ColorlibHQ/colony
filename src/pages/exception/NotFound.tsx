import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('state.empty')}
      extra={
        <Button type="primary" onClick={() => void navigate('/')}>
          {t('action.back')}
        </Button>
      }
    />
  );
}
