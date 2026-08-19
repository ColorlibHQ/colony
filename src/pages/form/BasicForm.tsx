import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
} from 'antd';
import type { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { PageHeader } from '@/components/common/PageHeader';

/**
 * Schema-first validation.
 *
 * The Zod schema is the single source of truth: `FormValues` is inferred from
 * it, so a field renamed here fails to compile at every call site rather than
 * silently validating nothing. Messages are i18n keys, resolved at render —
 * baking English into the schema would freeze it for the Chinese build.
 */
const schema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  email: z.string().email('validation.email'),
  role: z.string().min(1, 'validation.required'),
  team: z.array(z.string()).min(1, 'validation.teamMin'),
  seats: z
    .number()
    .int()
    .min(1, 'validation.seatsMin')
    .max(500, 'validation.seatsMax'),
  budget: z.number().min(0),
  visibility: z.enum(['public', 'private']),
  startsAt: z.custom<Dayjs | null>((v) => v != null, 'validation.required'),
  notify: z.boolean(),
  notes: z.string().max(280, 'validation.notesMax').optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BasicFormPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      role: '',
      team: [],
      seats: 5,
      budget: 2500,
      visibility: 'private',
      startsAt: null,
      notify: true,
      notes: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(
    async (values) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        void message.error(t('state.error'));
        return;
      }
      await new Promise((r) => setTimeout(r, 600));
      void message.success(t('state.saved'));
    },
    () => {
      void message.error(t('validation.fixErrors'));
    },
  );

  /** Errors carry i18n keys, so translate at render rather than at throw time. */
  const err = (field: keyof FormValues) => {
    const m = errors[field]?.message;
    return m ? t(m) : undefined;
  };

  const field = (
    label: string,
    name: keyof FormValues,
    node: React.ReactNode,
  ) => (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          marginBottom: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {node}
      {err(name) && (
        <div
          role="alert"
          style={{
            marginTop: 'var(--space-1)',
            color: 'var(--c-danger)',
            fontSize: 'var(--text-xs)',
          }}
        >
          {err(name)}
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title={t('nav.basicForm')}
        description={t('page.basicFormDesc')}
      />

      <form onSubmit={(e) => void onSubmit(e)} noValidate>
        <Row gutter={16}>
          <Col xs={24} xl={16}>
            <Card title={t('form.details')}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  {field(
                    t('form.name'),
                    'name',
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        validate: (v) =>
                          schema.shape.name.safeParse(v).success ||
                          'validation.nameMin',
                      }}
                      render={({ field: f }) => (
                        <Input
                          {...f}
                          id="name"
                          placeholder={t('form.namePlaceholder')}
                          status={errors.name ? 'error' : undefined}
                          aria-invalid={!!errors.name}
                        />
                      )}
                    />,
                  )}
                </Col>
                <Col xs={24} md={12}>
                  {field(
                    t('form.email'),
                    'email',
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        validate: (v) =>
                          schema.shape.email.safeParse(v).success ||
                          'validation.email',
                      }}
                      render={({ field: f }) => (
                        <Input
                          {...f}
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          status={errors.email ? 'error' : undefined}
                          aria-invalid={!!errors.email}
                        />
                      )}
                    />,
                  )}
                </Col>
                <Col xs={24} md={12}>
                  {field(
                    t('form.role'),
                    'role',
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: 'validation.required' }}
                      render={({ field: f }) => (
                        <Select
                          {...f}
                          id="role"
                          style={{ width: '100%' }}
                          placeholder={t('form.rolePlaceholder')}
                          status={errors.role ? 'error' : undefined}
                          options={[
                            { value: 'owner', label: t('role.owner') },
                            { value: 'admin', label: t('role.admin') },
                            { value: 'editor', label: t('role.editor') },
                            { value: 'viewer', label: t('role.viewer') },
                          ]}
                        />
                      )}
                    />,
                  )}
                </Col>
                <Col xs={24} md={12}>
                  {field(
                    t('form.team'),
                    'team',
                    <Controller
                      name="team"
                      control={control}
                      rules={{
                        validate: (v) => v.length > 0 || 'validation.teamMin',
                      }}
                      render={({ field: f }) => (
                        <Select
                          {...f}
                          id="team"
                          mode="multiple"
                          style={{ width: '100%' }}
                          placeholder={t('form.teamPlaceholder')}
                          status={errors.team ? 'error' : undefined}
                          options={[
                            { value: 'eng', label: t('team.engineering') },
                            { value: 'design', label: t('team.design') },
                            { value: 'sales', label: t('team.sales') },
                            { value: 'support', label: t('team.support') },
                          ]}
                        />
                      )}
                    />,
                  )}
                </Col>
                <Col xs={24} md={12}>
                  {field(
                    t('form.startsAt'),
                    'startsAt',
                    <Controller
                      name="startsAt"
                      control={control}
                      rules={{ required: 'validation.required' }}
                      render={({ field: f }) => (
                        <DatePicker
                          id="startsAt"
                          style={{ width: '100%' }}
                          status={errors.startsAt ? 'error' : undefined}
                          value={f.value}
                          onChange={f.onChange}
                        />
                      )}
                    />,
                  )}
                </Col>
                <Col xs={24} md={12}>
                  {field(
                    t('form.seats'),
                    'seats',
                    <Controller
                      name="seats"
                      control={control}
                      rules={{
                        validate: (v) =>
                          schema.shape.seats.safeParse(v).success ||
                          'validation.seatsMin',
                      }}
                      render={({ field: f }) => (
                        <InputNumber
                          {...f}
                          id="seats"
                          min={1}
                          max={500}
                          style={{ width: '100%' }}
                          status={errors.seats ? 'error' : undefined}
                        />
                      )}
                    />,
                  )}
                </Col>
              </Row>

              {field(
                t('form.notes'),
                'notes',
                <Controller
                  name="notes"
                  control={control}
                  render={({ field: f }) => (
                    <Input.TextArea
                      {...f}
                      id="notes"
                      rows={4}
                      showCount
                      maxLength={280}
                      placeholder={t('form.notesPlaceholder')}
                    />
                  )}
                />,
              )}
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card title={t('form.settings')}>
              {field(
                t('form.visibility'),
                'visibility',
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field: f }) => (
                    <Radio.Group
                      {...f}
                      options={[
                        { value: 'private', label: t('form.private') },
                        { value: 'public', label: t('form.public') },
                      ]}
                    />
                  )}
                />,
              )}

              {field(
                t('form.budget'),
                'budget',
                <Controller
                  name="budget"
                  control={control}
                  render={({ field: f }) => (
                    <Slider
                      {...f}
                      min={0}
                      max={10000}
                      step={100}
                      tooltip={{ formatter: (v) => `$${v ?? 0}` }}
                    />
                  )}
                />,
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                <label
                  htmlFor="notify"
                  style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}
                >
                  {t('form.notify')}
                </label>
                <Controller
                  name="notify"
                  control={control}
                  render={({ field: f }) => (
                    <Switch
                      id="notify"
                      checked={f.value}
                      onChange={f.onChange}
                    />
                  )}
                />
              </div>

              <Upload.Dragger multiple={false} beforeUpload={() => false}>
                <p style={{ margin: 0, color: 'var(--c-text-secondary)' }}>
                  {t('form.dropFiles')}
                </p>
              </Upload.Dragger>
            </Card>

            <Card style={{ marginTop: 'var(--space-4)' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  {t('action.submit')}
                </Button>
                <Button onClick={() => reset()} disabled={!isDirty}>
                  {t('action.reset')}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </form>
    </>
  );
}
