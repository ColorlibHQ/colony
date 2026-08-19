import { Card, Col, Radio, Row, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { useChartTheme } from '@/lib/chartTheme';
import {
  dailyVisits,
  revenueTrend,
  salesByChannel,
  topProducts,
  trafficByDevice,
  type ProductRow,
} from '@/mocks/data';

type Range = '7d' | '30d' | '12m';

export default function AnalysisPage() {
  const { t, i18n } = useTranslation();
  const chart = useChartTheme();
  const [range, setRange] = useState<Range>('12m');

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: i18n.language === 'zh-CN' ? 'CNY' : 'USD',
        maximumFractionDigits: 0,
      }),
    [i18n.language],
  );
  const number = useMemo(
    () => new Intl.NumberFormat(i18n.language),
    [i18n.language],
  );

  const trend = useMemo(() => {
    if (range === '12m') return revenueTrend;
    const days = range === '7d' ? 7 : 30;
    return dailyVisits.slice(-days).map((d) => ({
      label: `${d.day}`,
      revenue: d.value * 21,
      orders: Math.round(d.value / 6),
      visits: d.value,
    }));
  }, [range]);

  const columns: TableColumnsType<ProductRow> = [
    {
      title: t('table.product'),
      dataIndex: 'nameKey',
      render: (key: string, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{t(`product.${key}`)}</div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--c-text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {row.sku}
          </div>
        </div>
      ),
    },
    {
      title: t('table.category'),
      dataIndex: 'category',
      render: (c: string) => t(`category.${c}`),
      responsive: ['md'],
    },
    {
      title: t('table.price'),
      dataIndex: 'price',
      align: 'right',
      render: (v: number) => currency.format(v),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: t('table.sold'),
      dataIndex: 'sold',
      align: 'right',
      render: (v: number) => number.format(v),
      sorter: (a, b) => a.sold - b.sold,
      defaultSortOrder: 'descend',
    },
    {
      title: t('table.status'),
      dataIndex: 'status',
      render: (s: ProductRow['status']) => {
        // Status is carried by the label too, never colour alone.
        const color =
          s === 'active' ? 'success' : s === 'low' ? 'warning' : 'default';
        return <Tag color={color}>{t(`status.${s}`)}</Tag>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.analysis')}
        description={t('page.analysisDesc')}
        extra={
          <Radio.Group
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: t('range.7d'), value: '7d' },
              { label: t('range.30d'), value: '30d' },
              { label: t('range.12m'), value: '12m' },
            ]}
          />
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            label={t('stat.revenue')}
            value={currency.format(842_960)}
            delta={12.4}
            deltaLabel={t('stat.vsPrevious')}
            spark={dailyVisits.slice(-14)}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            label={t('stat.visits')}
            value={number.format(128_460)}
            delta={8.1}
            deltaLabel={t('stat.vsPrevious')}
            spark={dailyVisits.slice(-14)}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            label={t('stat.orders')}
            value={number.format(6_560)}
            delta={-3.2}
            deltaLabel={t('stat.vsPrevious')}
            spark={dailyVisits.slice(-14)}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            label={t('stat.conversion')}
            value="4.8%"
            delta={0.6}
            deltaLabel={t('stat.vsPrevious')}
            spark={dailyVisits.slice(-14)}
          />
        </Col>

        <Col xs={24} xl={16}>
          <Card title={t('chart.revenueTrend')}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trend}
                  margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chart.primary}
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="100%"
                        stopColor={chart.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={chart.grid}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis dataKey="label" {...chart.axisProps} />
                  <YAxis
                    {...chart.axisProps}
                    tickFormatter={(v: number) => number.format(v / 1000) + 'k'}
                  />
                  <RTooltip
                    {...chart.tooltip}
                    formatter={(v) => currency.format(Number(v))}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name={t('stat.revenue')}
                    stroke={chart.primary}
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title={t('chart.trafficByDevice')}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficByDevice.map((d) => ({
                      name: t(`device.${d.key}`),
                      value: d.value,
                    }))}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={94}
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {trafficByDevice.map((d, i) => (
                      <Cell key={d.key} fill={chart.seriesColor(i)} />
                    ))}
                  </Pie>
                  <RTooltip
                    {...chart.tooltip}
                    formatter={(v) => `${Number(v)}%`}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span style={{ color: chart.text, fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card title={t('chart.salesByChannel')}>
            <div style={{ height: 288 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByChannel.map((s) => ({
                    name: t(`channel.${s.key}`),
                    value: s.value,
                  }))}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                >
                  <CartesianGrid
                    stroke={chart.grid}
                    strokeDasharray="3 3"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    {...chart.axisProps}
                    tickFormatter={(v: number) => number.format(v / 1000) + 'k'}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={84}
                    {...chart.axisProps}
                  />
                  <RTooltip
                    {...chart.tooltip}
                    formatter={(v) => currency.format(Number(v))}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 4, 4, 0]}
                    isAnimationActive={false}
                  >
                    {salesByChannel.map((s, i) => (
                      <Cell key={s.key} fill={chart.seriesColor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card
            title={t('chart.topProducts')}
            styles={{ body: { padding: 0 } }}
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={topProducts}
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
