import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Input, Progress } from 'antd';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  email: z.string().email('validation.email'),
  password: z.string().min(8, 'validation.passwordMin'),
  accept: z.literal(true),
});

type Values = z.infer<typeof schema>;

/** Rough strength signal — length, case mix, digits, symbols. */
function strengthOf(pw: string): number {
  if (!pw) return 0;
  let score = Math.min(pw.length / 12, 1) * 45;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
  if (/\d/.test(pw)) score += 15;
  if (/[^A-Za-z0-9]/.test(pw)) score += 20;
  return Math.min(Math.round(score), 100);
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      accept: false as never,
    },
    mode: 'onBlur',
  });

  const password = useWatch({ control, name: 'password' });
  const strength = strengthOf(password ?? '');
  const strengthKey =
    strength < 40 ? 'weak' : strength < 70 ? 'fair' : 'strong';

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    void message.success(t('auth.accountCreated'));
    void navigate('/dashboard/analysis');
  });

  const err = (k: keyof Values) => {
    const m = errors[k]?.message;
    return m ? t(m) : undefined;
  };

  const row = (id: keyof Values, label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {node}
      {err(id) && (
        <div
          role="alert"
          style={{
            marginTop: 4,
            color: 'var(--c-danger)',
            fontSize: 'var(--text-xs)',
          }}
        >
          {err(id)}
        </div>
      )}
    </div>
  );

  return (
    <>
      <h1
        style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}
      >
        {t('auth.createAccount')}
      </h1>
      <p
        style={{
          color: 'var(--c-text-secondary)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {t('auth.createAccountSub')}
      </p>

      <form onSubmit={(e) => void onSubmit(e)} noValidate>
        {row(
          'name',
          t('form.name'),
          <Controller
            name="name"
            control={control}
            rules={{
              validate: (v) =>
                schema.shape.name.safeParse(v).success || 'validation.nameMin',
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                size="large"
                prefix={<UserOutlined />}
                status={errors.name ? 'error' : undefined}
                autoComplete="name"
              />
            )}
          />,
        )}

        {row(
          'email',
          t('form.email'),
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
                autoComplete="email"
              />
            )}
          />,
        )}

        {row(
          'password',
          t('form.password'),
          <>
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
                  autoComplete="new-password"
                />
              )}
            />
            {password ? (
              <div style={{ marginTop: 6 }}>
                <Progress
                  percent={strength}
                  showInfo={false}
                  size="small"
                  strokeColor={
                    strengthKey === 'weak'
                      ? 'var(--c-danger)'
                      : strengthKey === 'fair'
                        ? 'var(--c-warning)'
                        : 'var(--c-success)'
                  }
                />
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--c-text-tertiary)',
                  }}
                >
                  {t(`auth.strength.${strengthKey}`)}
                </span>
              </div>
            ) : null}
          </>,
        )}

        <div style={{ marginBottom: 'var(--space-5)' }}>
          <Controller
            name="accept"
            control={control}
            rules={{ validate: (v) => v === true || 'validation.mustAccept' }}
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                {t('auth.acceptTerms')}
              </Checkbox>
            )}
          />
          {err('accept') && (
            <div
              role="alert"
              style={{
                marginTop: 4,
                color: 'var(--c-danger)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {err('accept')}
            </div>
          )}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isSubmitting}
        >
          {t('auth.createAccount')}
        </Button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: 'var(--space-6)',
          color: 'var(--c-text-secondary)',
        }}
      >
        {t('auth.haveAccount')} <Link to="/auth/login">{t('auth.signIn')}</Link>
      </p>
    </>
  );
}
