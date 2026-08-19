import {
  AlertOutlined,
  CloudUploadOutlined,
  MessageOutlined,
  PullRequestOutlined,
} from '@ant-design/icons';
import { Badge, Card, Col, List, Progress, Row, Statistic, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageHeader } from '@/components/common/PageHeader';
import { useChartTheme } from '@/lib/chartTheme';
import { activityFeed, services, type ActivityItem } from '@/mocks/data';

const KIND_ICON: Record<ActivityItem['kind'], React.ReactNode> = {
  deploy: <CloudUploadOutlined />,
  merge: <PullRequestOutlined />,
  comment: <MessageOutlined />,
  alert: <AlertOutlined />,
};

const STATUS_BADGE = {
  healthy: 'success',
  degraded: 'warning',
  down: 'error',
} as const;

/** Seeded so the first frame is stable; only the live tick moves after mount. */
const INITIAL_STREAM = Array.from({ length: 24 }, (_, i) => ({
  t: i,
  rps: Math.round(820 + Math.sin(i / 2.4) * 180 + (i % 5) * 22),
}));

export default function MonitorPage() {
  const { t, i18n } = useTranslation();
  const chart = useChartTheme();
  const [stream, setStream] = useState(INITIAL_STREAM);

  // A live stream is the point of a monitor screen — but it must respect the
  // reduced-motion preference, which here means holding the chart still.
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced) return;
    const id = setInterval(() => {
      setStream((prev) => {
        const last = prev[prev.length - 1]!;
        const next = {
          t: last.t + 1,
          rps: Math.max(
            420,
            Math.min(1_400, last.rps + Math.round((Math.random() - 0.5) * 190)),
          ),
        };
        return [...prev.slice(1), next];
      });
    }, 2_000);
    return () => clearInterval(id);
  }, []);

  const number = new Intl.NumberFormat(i18n.language);
  const current = stream[stream.length - 1]?.rps ?? 0;
  const relTime = new Intl.RelativeTimeFormat(i18n.language, {
    numeric: 'auto',
  });

  return (
    <>
      <PageHeader
        title={t('nav.monitor')}
        description={t('page.monitorDesc')}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={t('chart.requestsPerSecond')}
            extra={
              <Badge
                status="processing"
                text={
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {number.format(current)} rps
                  </span>
                }
              />
            }
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stream}
                  margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                >
                  <CartesianGrid
                    stroke={chart.grid}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis dataKey="t" {...chart.axisProps} />
                  <YAxis domain={[300, 1500]} {...chart.axisProps} />
                  <RTooltip {...chart.tooltip} />
                  <Line
                    type="monotone"
                    dataKey="rps"
                    name={t('chart.requestsPerSecond')}
                    stroke={chart.primary}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={t('monitor.services')}>
            <List
              dataSource={services}
              renderItem={(s) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Badge
                        status={STATUS_BADGE[s.status]}
                        text={t(`service.${s.key}`)}
                      />
                    }
                    description={
                      <span style={{ fontSize: 'var(--text-xs)' }}>
                        {t('monitor.uptime')} {s.uptime}% · {s.latencyMs}ms
                      </span>
                    }
                  />
                  <Tag
                    color={
                      s.status === 'healthy'
                        ? 'success'
                        : s.status === 'degraded'
                          ? 'warning'
                          : 'error'
                    }
                  >
                    {t(`serviceStatus.${s.status}`)}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('monitor.cpu')}
              value={62}
              suffix="%"
              valueStyle={{ fontVariantNumeric: 'tabular-nums' }}
            />
            <Progress percent={62} showInfo={false} strokeLinecap="butt" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('monitor.memory')}
              value={78}
              suffix="%"
              valueStyle={{ fontVariantNumeric: 'tabular-nums' }}
            />
            <Progress
              percent={78}
              showInfo={false}
              strokeLinecap="butt"
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('monitor.disk')}
              value={91}
              suffix="%"
              valueStyle={{
                color: 'var(--c-danger)',
                fontVariantNumeric: 'tabular-nums',
              }}
            />
            <Progress
              percent={91}
              showInfo={false}
              strokeLinecap="butt"
              status="exception"
            />
          </Card>
        </Col>

        <Col xs={24}>
          <Card title={t('monitor.activity')}>
            <List
              dataSource={activityFeed}
              renderItem={(a) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'grid',
                          placeItems: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--c-surface-sunken)',
                          color: 'var(--c-text-secondary)',
                        }}
                      >
                        {KIND_ICON[a.kind]}
                      </span>
                    }
                    title={
                      <span>
                        <strong>{t(`person.${a.actorKey}`)}</strong>{' '}
                        {t(`activity.${a.actionKey}`)}{' '}
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                          }}
                        >
                          {a.target}
                        </span>
                      </span>
                    }
                    description={relTime.format(-a.minutesAgo, 'minute')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
