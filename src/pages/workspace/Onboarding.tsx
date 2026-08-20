import { CheckCircleFilled, RightOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Progress,
  Result,
  Row,
  Space,
  Typography,
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { PageHeader } from '@/components/common/PageHeader';

interface Step {
  key: string;
  /** Where the step actually takes you — a checklist that cannot be acted on
   *  is decoration. */
  to: string;
  /** Pre-ticked because it genuinely is done for a new workspace. */
  done: boolean;
}

const STEPS: Step[] = [
  { key: 'account', to: '/account/settings', done: true },
  { key: 'theme', to: '/theme-studio', done: true },
  { key: 'team', to: '/access', done: false },
  { key: 'data', to: '/table', done: false },
  { key: 'billing', to: '/billing', done: false },
  { key: 'invite', to: '/workspace/inbox', done: false },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<string[]>(
    STEPS.filter((s) => s.done).map((s) => s.key),
  );

  const percent = Math.round((completed.length / STEPS.length) * 100);
  const allDone = completed.length === STEPS.length;

  const toggle = (key: string) =>
    setCompleted((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  return (
    <>
      <PageHeader
        title={t('nav.onboarding')}
        description={t('page.onboardingDesc')}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          {allDone ? (
            <Card>
              <Result
                icon={
                  <CheckCircleFilled style={{ color: 'var(--c-success)' }} />
                }
                title={t('onboarding.doneTitle')}
                subTitle={t('onboarding.doneDesc')}
                extra={
                  <Button
                    type="primary"
                    onClick={() => void navigate('/dashboard/analysis')}
                  >
                    {t('exception.goHome')}
                  </Button>
                }
              />
            </Card>
          ) : (
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {STEPS.map((step, i) => {
                const isDone = completed.includes(step.key);
                return (
                  <Card
                    key={step.key}
                    styles={{
                      body: { padding: 'var(--space-4) var(--space-5)' },
                    }}
                    style={{ opacity: isDone ? 0.7 : 1 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'grid',
                          placeItems: 'center',
                          width: 30,
                          height: 30,
                          flexShrink: 0,
                          borderRadius: '50%',
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: 'var(--text-sm)',
                          background: isDone
                            ? 'var(--c-success)'
                            : 'var(--c-surface-sunken)',
                          color: isDone ? '#fff' : 'var(--c-text-secondary)',
                        }}
                      >
                        {isDone ? <CheckCircleFilled /> : i + 1}
                      </span>

                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}
                        >
                          {t(`onboardingStep.${step.key}.title`)}
                        </div>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 'var(--text-sm)' }}
                        >
                          {t(`onboardingStep.${step.key}.desc`)}
                        </Typography.Text>
                      </div>

                      <Space>
                        <Button size="small" onClick={() => toggle(step.key)}>
                          {isDone
                            ? t('onboarding.undo')
                            : t('onboarding.markDone')}
                        </Button>
                        <Button
                          type={isDone ? 'default' : 'primary'}
                          size="small"
                          icon={<RightOutlined />}
                          onClick={() => void navigate(step.to)}
                        >
                          {t('onboarding.go')}
                        </Button>
                      </Space>
                    </div>
                  </Card>
                );
              })}
            </Space>
          )}
        </Col>

        <Col xs={24} xl={8}>
          <Card title={t('onboarding.progress')}>
            <Progress
              type="circle"
              percent={percent}
              style={{ display: 'block', margin: '0 auto var(--space-5)' }}
            />
            <Typography.Paragraph
              type="secondary"
              style={{ textAlign: 'center', margin: 0 }}
            >
              {t('onboarding.remaining', {
                count: STEPS.length - completed.length,
              })}
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );
}
