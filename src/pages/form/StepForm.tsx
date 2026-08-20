import { CheckCircleFilled } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Input,
  InputNumber,
  Result,
  Select,
  Space,
  Steps,
} from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { PageHeader } from '@/components/common/PageHeader';

const schema = z.object({
  account: z.string().min(4, 'validation.accountMin'),
  receiver: z.string().min(2, 'validation.nameMin'),
  amount: z.number().min(1, 'validation.amountMin'),
  method: z.string().min(1, 'validation.required'),
  note: z.string().optional(),
});
type Values = z.infer<typeof schema>;

const FIELDS_PER_STEP: (keyof Values)[][] = [
  ['account', 'receiver', 'amount', 'method'],
  [],
  [],
];

export default function StepFormPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      account: '',
      receiver: '',
      amount: 500,
      method: 'bank',
      note: '',
    },
    mode: 'onBlur',
  });

  /** Only the current step's fields are validated — validating the whole form
   *  would flag step 2 errors while the user is still on step 1. */
  const next = async () => {
    const ok = await trigger(FIELDS_PER_STEP[step]);
    if (ok) setStep((s) => s + 1);
  };

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 600));
    setStep(2);
  });

  const err = (k: keyof Values) => {
    const m = errors[k]?.message;
    return m ? t(m) : undefined;
  };

  const field = (name: keyof Values, label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <label
        htmlFor={name}
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
      {err(name) && (
        <div
          role="alert"
          style={{
            marginTop: 4,
            color: 'var(--c-danger)',
            fontSize: 'var(--text-xs)',
          }}
        >
          {err(name)}
        </div>
      )}
    </div>
  );

  const values = getValues();

  return (
    <>
      <PageHeader
        title={t('nav.stepForm')}
        description={t('page.stepFormDesc')}
      />

      <Card>
        <Steps
          current={step}
          style={{ maxWidth: 720, margin: '0 auto var(--space-8)' }}
          items={[
            { title: t('steps.details') },
            { title: t('steps.review') },
            { title: t('steps.done') },
          ]}
        />

        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {step === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void next();
              }}
              noValidate
            >
              {field(
                'account',
                t('form.payFrom'),
                <Controller
                  name="account"
                  control={control}
                  rules={{
                    validate: (v) =>
                      schema.shape.account.safeParse(v).success ||
                      'validation.accountMin',
                  }}
                  render={({ field: f }) => (
                    <Input
                      {...f}
                      id="account"
                      placeholder="6222 0000 0000 0000"
                      status={errors.account ? 'error' : undefined}
                    />
                  )}
                />,
              )}
              {field(
                'receiver',
                t('form.payTo'),
                <Controller
                  name="receiver"
                  control={control}
                  rules={{
                    validate: (v) =>
                      schema.shape.receiver.safeParse(v).success ||
                      'validation.nameMin',
                  }}
                  render={({ field: f }) => (
                    <Input
                      {...f}
                      id="receiver"
                      status={errors.receiver ? 'error' : undefined}
                    />
                  )}
                />,
              )}
              {field(
                'amount',
                t('form.amount'),
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    validate: (v) =>
                      schema.shape.amount.safeParse(v).success ||
                      'validation.amountMin',
                  }}
                  render={({ field: f }) => (
                    <InputNumber
                      {...f}
                      id="amount"
                      min={1}
                      style={{ width: '100%' }}
                      prefix="$"
                      status={errors.amount ? 'error' : undefined}
                    />
                  )}
                />,
              )}
              {field(
                'method',
                t('form.method'),
                <Controller
                  name="method"
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      {...f}
                      id="method"
                      style={{ width: '100%' }}
                      options={[
                        { value: 'bank', label: t('method.bank') },
                        { value: 'card', label: t('method.card') },
                        { value: 'wallet', label: t('method.wallet') },
                      ]}
                    />
                  )}
                />,
              )}
              <Button type="primary" htmlType="submit" block>
                {t('action.next')}
              </Button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={(e) => void onSubmit(e)} noValidate>
              <Alert
                type="info"
                showIcon
                message={t('form.reviewNotice')}
                style={{ marginBottom: 'var(--space-5)' }}
              />
              <Descriptions
                column={1}
                bordered
                size="small"
                style={{ marginBottom: 'var(--space-5)' }}
                items={[
                  {
                    key: 'a',
                    label: t('form.payFrom'),
                    children: values.account,
                  },
                  {
                    key: 'b',
                    label: t('form.payTo'),
                    children: values.receiver,
                  },
                  {
                    key: 'c',
                    label: t('form.amount'),
                    children: `$${values.amount}`,
                  },
                  {
                    key: 'd',
                    label: t('form.method'),
                    children: t(`method.${values.method}`),
                  },
                ]}
              />
              <Space style={{ width: '100%' }}>
                <Button onClick={() => setStep(0)}>{t('action.back')}</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  block
                >
                  {t('action.submit')}
                </Button>
              </Space>
            </form>
          )}

          {step === 2 && (
            <Result
              icon={<CheckCircleFilled style={{ color: 'var(--c-success)' }} />}
              title={t('form.transferDone')}
              subTitle={t('form.transferDoneDesc', {
                amount: values.amount,
                to: values.receiver,
              })}
              extra={
                <Button type="primary" onClick={() => setStep(0)}>
                  {t('form.newTransfer')}
                </Button>
              }
            />
          )}
        </div>
      </Card>
    </>
  );
}
