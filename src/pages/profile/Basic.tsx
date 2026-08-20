import { Badge, Card, Descriptions, Space, Table, Tag, Timeline } from 'antd';
import type { TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { orders, CUSTOMERS_EN, CUSTOMERS_ZH, type Order } from '@/mocks/orders';

export default function ProfileBasicPage() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';
  const order = orders[0]!;
  const lines = orders.slice(0, 5);

  const currency = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: isZh ? 'CNY' : 'USD',
    maximumFractionDigits: 0,
  });
  const nameOf = (o: Order) =>
    (isZh ? CUSTOMERS_ZH : CUSTOMERS_EN)[o.customerSeed]!;

  const columns: TableColumnsType<Order> = [
    { title: t('table.reference'), dataIndex: 'reference' },
    { title: t('table.items'), dataIndex: 'items', align: 'right' },
    {
      title: t('table.amount'),
      dataIndex: 'amount',
      align: 'right',
      render: (v: number) => currency.format(v),
    },
    {
      title: t('table.status'),
      dataIndex: 'status',
      render: (s: string) => <Tag>{t(`orderStatus.${s}`)}</Tag>,
    },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.profileBasic')}
        description={t('page.profileBasicDesc')}
      />

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <Descriptions
          title={t('profile.orderDetails')}
          column={{ xs: 1, sm: 2, lg: 3 }}
          items={[
            {
              key: '1',
              label: t('table.reference'),
              children: order.reference,
            },
            { key: '2', label: t('table.customer'), children: nameOf(order) },
            {
              key: '3',
              label: t('table.channel'),
              children: t(`channel.${order.channel}`),
            },
            { key: '4', label: t('table.created'), children: order.createdAt },
            {
              key: '5',
              label: t('table.amount'),
              children: currency.format(order.amount),
            },
            {
              key: '6',
              label: t('table.status'),
              children: (
                <Badge
                  status="success"
                  text={t(`orderStatus.${order.status}`)}
                />
              ),
            },
          ]}
        />
      </Card>

      <Card
        title={t('profile.lineItems')}
        style={{ marginBottom: 'var(--space-4)' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={lines}
          pagination={false}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Card title={t('profile.history')}>
        <Timeline
          items={[
            {
              color: 'green',
              children: (
                <Space direction="vertical" size={0}>
                  <strong>{t('profile.placed')}</strong>
                  <span
                    style={{
                      color: 'var(--c-text-tertiary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    2026-08-14 09:12
                  </span>
                </Space>
              ),
            },
            {
              color: 'green',
              children: (
                <Space direction="vertical" size={0}>
                  <strong>{t('profile.paid')}</strong>
                  <span
                    style={{
                      color: 'var(--c-text-tertiary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    2026-08-14 09:14
                  </span>
                </Space>
              ),
            },
            {
              color: 'blue',
              children: (
                <Space direction="vertical" size={0}>
                  <strong>{t('profile.packed')}</strong>
                  <span
                    style={{
                      color: 'var(--c-text-tertiary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    2026-08-15 11:40
                  </span>
                </Space>
              ),
            },
            {
              children: (
                <Space direction="vertical" size={0}>
                  <strong>{t('profile.shipped')}</strong>
                  <span
                    style={{
                      color: 'var(--c-text-tertiary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    {t('profile.pending')}
                  </span>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
