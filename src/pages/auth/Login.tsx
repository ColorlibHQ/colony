import {
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { App, Alert, Button, Checkbox, Divider, Input, Space } from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(8, 'validation.passwordMin'),
  remember: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: { email: 'demo@colony.dev', password: '', remember: true },
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (values) => {
    setFailed(false);
    await new Promise((r) => setTimeout(r, 500));
    // Demo credential check — the point is to show the error path, not to auth.
    if (values.password !== 'colony-demo') {
      setFailed(true);
      return;
    }
    void message.success(t('auth.welcomeBack'));
    void navigate('/dashboard/analysis');
  });

  const err = (k: keyof Values) => {
    const m = errors[k]?.message;
    return m ? t(m) : undefined;
  };

  return (
    <>
      <h1
        style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}
      >
        {t('auth.signIn')}
      </h1>
      <p
        style={{
          color: 'var(--c-text-secondary)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {t('auth.signInSub')}
      </p>

      {failed && (
        <Alert
          type="error"
          showIcon
          message={t('auth.badCredentials')}
          description={t('auth.demoHint')}
          style={{ marginBottom: 'var(--space-4)' }}
        />
      )}

      <form onSubmit={(e) => void onSubmit(e)} noValidate>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
            }}
          >
            {t('form.email')}
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              validate: (v) =>
                schema.shape.email.safeParse(v).success || 'validation.email',
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                size="large"
                prefix={<MailOutlined />}
                status={errors.email ? 'error' : undefined}
                aria-invalid={!!errors.email}
                autoComplete="email"
              />
            )}
          />
          {err('email') && (
            <div
              role="alert"
              style={{
                marginTop: 4,
                color: 'var(--c-danger)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {err('email')}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
            }}
          >
            {t('form.password')}
          </label>
          <Controller
            name="password"
            control={control}
            rules={{
              validate: (v) =>
                schema.shape.password.safeParse(v).success ||
                'validation.passwordMin',
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                id="password"
                size="large"
                prefix={<LockOutlined />}
                status={errors.password ? 'error' : undefined}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
              />
            )}
          />
          {err('password') && (
            <div
              role="alert"
              style={{
                marginTop: 4,
                color: 'var(--c-danger)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {err('password')}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-5)',
          }}
        >
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={field.onChange}>
                {t('auth.remember')}
              </Checkbox>
            )}
          />
          <Link to="/auth/forgot">{t('auth.forgot')}</Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isSubmitting}
        >
          {t('auth.signIn')}
        </Button>
      </form>

      <Divider
        plain
        style={{ color: 'var(--c-text-tertiary)', fontSize: 'var(--text-xs)' }}
      >
        {t('auth.orContinue')}
      </Divider>

      <Space style={{ width: '100%' }} size={8}>
        <Button
          size="large"
          icon={<GithubOutlined />}
          style={{ flex: 1 }}
          block
        >
          GitHub
        </Button>
        <Button
          size="large"
          icon={<GoogleOutlined />}
          style={{ flex: 1 }}
          block
        >
          Google
        </Button>
      </Space>

      <p
        style={{
          textAlign: 'center',
          marginTop: 'var(--space-6)',
          color: 'var(--c-text-secondary)',
        }}
      >
        {t('auth.noAccount')}{' '}
        <Link to="/auth/register">{t('auth.signUp')}</Link>
      </p>
    </>
  );
}
