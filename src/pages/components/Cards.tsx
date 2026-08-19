import {
  ArrowUpOutlined,
  CheckOutlined,
  CloudServerOutlined,
  EditOutlined,
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer } from 'recharts';

import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { useChartTheme } from '@/lib/chartTheme';
import { dailyVisits, services } from '@/mocks/data';

/**
 * Each plan names its own features. Generating them as f1..fN made higher tiers
 * inherit lower-tier copy, so Team listed both "Up to 3 projects" and
 * "Unlimited projects".
 */
const PLANS = [
  {
    key: 'starter',
    price: 0,
    featured: false,
    features: ['projects3', 'communitySupport', 'storage1'],
  },
  {
    key: 'team',
    price: 29,
    featured: true,
    features: ['projectsUnlimited', 'prioritySupport', 'storage50', 'roles'],
  },
  {
    key: 'scale',
    price: 99,
    featured: false,
    features: ['everythingInTeam', 'sso', 'auditLog', 'storage500', 'sla'],
  },
] as const;

export default function CardsPage() {
  const { t } = useTranslation();
  const chart = useChartTheme();

  return (
    <>
      <PageHeader title={t('nav.cards')} description={t('page.cardsDesc')} />

      {/* ---- KPI ---- */}
      <h2
        style={{
          fontSize: 'var(--text-md)',
          margin: 'var(--space-2) 0 var(--space-4)',
        }}
      >
        {t('cards.kpi')}
      </h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 'var(--space-8)' }}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            label={t('stat.revenue')}
            value="$842,960"
            delta={12.4}
            deltaLabel={t('stat.vsPrevious')}
            spark={dailyVisits.slice(-14)}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title={t('stat.orders')}
              value={6560}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: 'var(--c-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <span
                style={{
                  color: 'var(--c-text-secondary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {t('cards.storage')}
              </span>
              <Progress percent={68} strokeLinecap="butt" />
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--c-text-tertiary)',
                }}
              >
                {t('cards.storageUsed', { used: '340', total: '500' })}
              </span>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card styles={{ body: { padding: 0, overflow: 'hidden' } }}>
            <div style={{ padding: 'var(--space-5) var(--space-5) 0' }}>
              <Statistic title={t('stat.visits')} value={128460} />
            </div>
            <div style={{ height: 64 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyVisits.slice(-16)}>
                  <Bar
                    dataKey="value"
                    fill={chart.primary}
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ---- Structure ---- */}
      <h2 style={{ fontSize: 'var(--text-md)', margin: '0 0 var(--space-4)' }}>
        {t('cards.structure')}
      </h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 'var(--space-8)' }}>
        <Col xs={24} md={12} xl={8}>
          <Card
            title={t('cards.withActions')}
            extra={<Button type="text" icon={<EllipsisOutlined />} />}
            actions={[
              <SettingOutlined key="s" />,
              <EditOutlined key="e" />,
              <ShareAltOutlined key="sh" />,
            ]}
          >
            <p style={{ margin: 0, color: 'var(--c-text-secondary)' }}>
              {t('cards.withActionsDesc')}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            title={t('cards.withTabs')}
            tabList={[
              { key: 'overview', tab: t('cards.tabOverview') },
              { key: 'activity', tab: t('cards.tabActivity') },
            ]}
          >
            <p style={{ margin: 0, color: 'var(--c-text-secondary)' }}>
              {t('cards.withTabsDesc')}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Badge.Ribbon text={t('cards.new')} color="var(--ant-color-primary)">
            <Card title={t('cards.withRibbon')}>
              <p style={{ margin: 0, color: 'var(--c-text-secondary)' }}>
                {t('cards.withRibbonDesc')}
              </p>
            </Card>
          </Badge.Ribbon>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card loading title={t('cards.loading')} />
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            hoverable
            title={t('cards.hoverable')}
            styles={{ body: { padding: 'var(--space-5)' } }}
          >
            <p style={{ margin: 0, color: 'var(--c-text-secondary)' }}>
              {t('cards.hoverableDesc')}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card title={t('cards.inner')}>
            <Card type="inner" title={t('cards.innerTitle')} size="small">
              {t('cards.innerDesc')}
            </Card>
          </Card>
        </Col>
      </Row>

      {/* ---- Content patterns ---- */}
      <h2 style={{ fontSize: 'var(--text-md)', margin: '0 0 var(--space-4)' }}>
        {t('cards.patterns')}
      </h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 'var(--space-8)' }}>
        <Col xs={24} md={12} xl={8}>
          <Card>
            <Card.Meta
              avatar={
                <Avatar
                  size={48}
                  style={{ background: 'var(--ant-color-primary)' }}
                >
                  W
                </Avatar>
              }
              title={t('person.wei')}
              description={t('cards.profileRole')}
            />
            <Divider style={{ margin: 'var(--space-4) 0' }} />
            <Row>
              {[
                { k: 'cards.statProjects', v: '12' },
                { k: 'cards.statReviews', v: '84' },
                { k: 'cards.statTeams', v: '3' },
              ].map((s) => (
                <Col span={8} key={s.k} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--c-text-tertiary)',
                    }}
                  >
                    {t(s.k)}
                  </div>
                </Col>
              ))}
            </Row>
            <Space style={{ marginTop: 'var(--space-4)', width: '100%' }}>
              <Button type="primary" block>
                {t('cards.follow')}
              </Button>
              <Button icon={<MessageOutlined />} />
              <Button icon={<HeartOutlined />} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            title={
              <Space>
                <CloudServerOutlined />
                {t('monitor.services')}
              </Space>
            }
            styles={{ body: { padding: '0 var(--space-5)' } }}
          >
            <List
              dataSource={services}
              renderItem={(s) => (
                <List.Item>
                  <Badge
                    status={
                      s.status === 'healthy'
                        ? 'success'
                        : s.status === 'degraded'
                          ? 'warning'
                          : 'error'
                    }
                    text={t(`service.${s.key}`)}
                  />
                  <span
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--c-text-secondary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {s.latencyMs}ms
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            title={t('cards.chartCard')}
            extra={<Tag color="success">+12.4%</Tag>}
            styles={{ body: { paddingBottom: 0 } }}
          >
            <Statistic value={842960} prefix="$" />
            <div
              style={{
                height: 120,
                marginInline: -24,
                marginTop: 'var(--space-3)',
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyVisits}>
                  <defs>
                    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chart.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={chart.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chart.primary}
                    strokeWidth={2}
                    fill="url(#cardGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ---- Pricing ---- */}
      <h2 style={{ fontSize: 'var(--text-md)', margin: '0 0 var(--space-4)' }}>
        {t('cards.pricing')}
      </h2>
      <Row gutter={[16, 16]}>
        {PLANS.map((plan) => (
          <Col xs={24} md={8} key={plan.key}>
            <Card
              style={
                plan.featured
                  ? { borderColor: 'var(--ant-color-primary)', borderWidth: 2 }
                  : undefined
              }
              styles={{ body: { padding: 'var(--space-6)' } }}
            >
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Space>
                  <strong style={{ fontSize: 'var(--text-md)' }}>
                    {t(`plan.${plan.key}`)}
                  </strong>
                  {plan.featured && (
                    <Tag color="processing">{t('cards.popular')}</Tag>
                  )}
                </Space>
                <div
                  style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span style={{ color: 'var(--c-text-tertiary)' }}>
                    {t('cards.perMonth')}
                  </span>
                </div>
              </Space>

              <Divider style={{ margin: 'var(--space-4) 0' }} />

              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {plan.features.map((f) => (
                  <Space key={f} align="start">
                    <CheckOutlined style={{ color: 'var(--c-success)' }} />
                    <span style={{ fontSize: 'var(--text-sm)' }}>
                      {t(`planFeature.${f}`)}
                    </span>
                  </Space>
                ))}
              </Space>

              <Button
                type={plan.featured ? 'primary' : 'default'}
                block
                size="large"
                style={{ marginTop: 'var(--space-5)' }}
              >
                {plan.price === 0
                  ? t('cards.getStarted')
                  : t('cards.choosePlan')}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
