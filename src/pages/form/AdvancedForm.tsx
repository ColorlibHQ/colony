import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Affix,
  Alert,
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { PageHeader } from '@/components/common/PageHeader';

const lineSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  qty: z.number().int().min(1, 'validation.qtyMin'),
  unit: z.number().min(0, 'validation.required'),
});

const schema = z.object({
  title: z.string().min(2, 'validation.nameMin'),
  owner: z.string().min(1, 'validation.required'),
  region: z.string().min(1, 'validation.required'),
  lines: z.array(lineSchema).min(1, 'validation.linesMin'),
});
type Values = z.infer<typeof schema>;

export default function AdvancedFormPage() {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const isZh = i18n.language === 'zh-CN';
  const currency = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: isZh ? 'CNY' : 'USD',
    maximumFractionDigits: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      title: '',
      owner: 'wei',
      region: 'emea',
      lines: [{ name: 'Aurora Sensor Kit', qty: 2, unit: 249 }],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const lines = useWatch({ control, name: 'lines' }) ?? [];
  const total = lines.reduce((a, l) => a + (l?.qty ?? 0) * (l?.unit ?? 0), 0);

  const onSubmit = handleSubmit(
    async () => {
      await new Promise((r) => setTimeout(r, 600));
      void message.success(t('state.saved'));
    },
    () => void message.error(t('validation.fixErrors')),
  );

  const err = (k: keyof Values) => {
    const m = errors[k]?.message;
    return m ? t(m) : undefined;
  };

  const columns: TableColumnsType<(typeof fields)[number]> = [
    {
      title: t('table.product'),
      render: (_v, _r, i) => (
        <Controller
          name={`lines.${i}.name`}
          control={control}
          rules={{ required: 'validation.required' }}
          render={({ field }) => (
            <Input
              {...field}
              status={errors.lines?.[i]?.name ? 'error' : undefined}
              aria-label={t('table.product')}
            />
          )}
        />
      ),
    },
    {
      title: t('table.items'),
      width: 120,
      render: (_v, _r, i) => (
        <Controller
          name={`lines.${i}.qty`}
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={1}
              style={{ width: '100%' }}
              aria-label={t('table.items')}
            />
          )}
        />
      ),
    },
    {
      title: t('form.unitPrice'),
      width: 140,
      render: (_v, _r, i) => (
        <Controller
          name={`lines.${i}.unit`}
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0}
              style={{ width: '100%' }}
              aria-label={t('form.unitPrice')}
            />
          )}
        />
      ),
    },
    {
      title: t('form.lineTotal'),
      align: 'right',
      width: 130,
      render: (_v, _r, i) =>
        currency.format((lines[i]?.qty ?? 0) * (lines[i]?.unit ?? 0)),
    },
    {
      title: '',
      width: 56,
      align: 'right',
      render: (_v, _r, i) => (
        <Tooltip
          title={fields.length === 1 ? t('form.lastLine') : t('action.delete')}
        >
          {/* Disabling the last row's delete keeps the form in a valid state
              instead of letting the user reach an empty, unsubmittable order. */}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label={t('action.delete')}
            disabled={fields.length === 1}
            onClick={() => remove(i)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.advancedForm')}
        description={t('page.advancedFormDesc')}
      />

      <form onSubmit={(e) => void onSubmit(e)} noValidate>
        <Card
          title={t('form.details')}
          style={{ marginBottom: 'var(--space-4)' }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <label
                htmlFor="title"
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                }}
              >
                {t('form.orderTitle')}
              </label>
              <Controller
                name="title"
                control={control}
                rules={{
                  validate: (v) =>
                    schema.shape.title.safeParse(v).success ||
                    'validation.nameMin',
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder={t('form.orderTitlePlaceholder')}
                    status={errors.title ? 'error' : undefined}
                  />
                )}
              />
              {err('title') && (
                <div
                  role="alert"
                  style={{
                    marginTop: 4,
                    color: 'var(--c-danger)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  {err('title')}
                </div>
              )}
            </Col>
            <Col xs={24} md={8}>
              <label
                htmlFor="owner"
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                }}
              >
                {t('form.owner')}
              </label>
              <Controller
                name="owner"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="owner"
                    style={{ width: '100%' }}
                    options={(
                      ['wei', 'marta', 'jonas', 'li', 'ana'] as const
                    ).map((k) => ({ value: k, label: t(`person.${k}`) }))}
                  />
                )}
              />
            </Col>
            <Col xs={24} md={8}>
              <label
                htmlFor="region"
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                }}
              >
                {t('form.region')}
              </label>
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="region"
                    style={{ width: '100%' }}
                    options={(['emea', 'amer', 'apac'] as const).map((k) => ({
                      value: k,
                      label: t(`region.${k}`),
                    }))}
                  />
                )}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 'var(--space-4)', maxWidth: 320 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
              }}
            >
              {t('form.deliverBy')}
            </label>
            <DatePicker style={{ width: '100%' }} />
          </div>
        </Card>

        <Card
          title={t('form.lineItems')}
          style={{ marginBottom: 'var(--space-4)' }}
          extra={
            <Button
              icon={<PlusOutlined />}
              onClick={() => append({ name: '', qty: 1, unit: 0 })}
            >
              {t('form.addLine')}
            </Button>
          }
          styles={{ body: { padding: 0 } }}
        >
          {errors.lines?.root && (
            <Alert
              type="error"
              showIcon
              message={t('validation.linesMin')}
              style={{ margin: 'var(--space-4)' }}
            />
          )}
          <Table
            rowKey="id"
            columns={columns}
            dataSource={fields}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <strong>{t('form.total')}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {currency.format(total)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
              </Table.Summary.Row>
            )}
          />
        </Card>

        <Affix offsetBottom={0}>
          <Card styles={{ body: { paddingBlock: 'var(--space-4)' } }}>
            <Space
              style={{ width: '100%', justifyContent: 'space-between' }}
              wrap
            >
              <span style={{ color: 'var(--c-text-secondary)' }}>
                {t('form.lineCount', { count: fields.length })} ·{' '}
                <strong>{currency.format(total)}</strong>
              </span>
              <Space>
                <Button>{t('action.cancel')}</Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  {t('action.submit')}
                </Button>
              </Space>
            </Space>
          </Card>
        </Affix>
      </form>
    </>
  );
}
