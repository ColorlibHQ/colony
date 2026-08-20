import {
  Badge,
  Button,
  Card,
  Descriptions,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { CUSTOMERS_EN, CUSTOMERS_ZH, orders, type Order } from '@/mocks/orders';

export default function ProfileAdvancedPage() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';
  const currency = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: isZh ? 'CNY' : 'USD',
    maximumFractionDigits: 0,
  });
  const nameOf = (o: Order) =>
    (isZh ? CUSTOMERS_ZH : CUSTOMERS_EN)[o.customerSeed]!;
  const rows = orders.slice(0, 8);

  const columns: TableColumnsType<Order> = [
    { title: t('table.reference'), dataIndex: 'reference' },
    { title: t('table.customer'), render: (_v, o) => nameOf(o) },
    {
      title: t('table.channel'),
      dataIndex: 'channel',
      render: (c: string) => t(`channel.${c}`),
    },
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
        title={t('nav.profileAdvanced')}
        description={t('page.profileAdvancedDesc')}
        extra={
          <Space>
            <Button>{t('action.export')}</Button>
            <Button type="primary">{t('action.edit')}</Button>
          </Space>
        }
      />

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <Descriptions
          column={{ xs: 1, sm: 2, lg: 4 }}
          items={[
            {
              key: '1',
              label: t('profile.accountName'),
              children: 'Northwind Logistics',
            },
            {
              key: '2',
              label: t('profile.accountOwner'),
              children: t('person.marta'),
            },
            { key: '3', label: t('form.region'), children: t('region.emea') },
            { key: '4', label: t('profile.since'), children: '2024-03-11' },
          ]}
        />
        <Space size={48} wrap style={{ marginTop: 'var(--space-5)' }}>
          <Statistic
            title={t('profile.lifetimeValue')}
            value={182_400}
            prefix={isZh ? '¥' : '$'}
          />
          <Statistic title={t('stat.orders')} value={rows.length * 31} />
          <Statistic
            title={t('profile.openTickets')}
            value={2}
            valueStyle={{ color: 'var(--c-warning)' }}
          />
          <Statistic
            title={t('profile.health')}
            value={94}
            suffix="%"
            valueStyle={{ color: 'var(--c-success)' }}
          />
        </Space>
      </Card>

      <Card styles={{ body: { paddingTop: 0 } }}>
        <Tabs
          items={[
            {
              key: 'orders',
              label: t('profile.tabOrders'),
              children: (
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={rows}
                  size="small"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              ),
            },
            {
              key: 'activity',
              label: t('profile.tabActivity'),
              children: (
                <Timeline
                  style={{ paddingTop: 'var(--space-4)' }}
                  items={[
                    {
                      color: 'green',
                      children: `${t('person.wei')} — ${t('profile.renewed')}`,
                    },
                    {
                      color: 'blue',
                      children: `${t('person.li')} — ${t('profile.ticketOpened')}`,
                    },
                    {
                      color: 'gray',
                      children: `${t('person.ana')} — ${t('profile.planChanged')}`,
                    },
                    {
                      color: 'gray',
                      children: `${t('person.jonas')} — ${t('profile.onboarded')}`,
                    },
                  ]}
                />
              ),
            },
            {
              key: 'contacts',
              label: t('profile.tabContacts'),
              children: (
                <Descriptions
                  column={{ xs: 1, md: 2 }}
                  bordered
                  size="small"
                  style={{ marginTop: 'var(--space-4)' }}
                  items={[
                    {
                      key: 'a',
                      label: t('profile.primary'),
                      children: (
                        <Badge status="success" text={t('person.marta')} />
                      ),
                    },
                    {
                      key: 'b',
                      label: t('form.email'),
                      children: 'marta@northwind.example',
                    },
                    {
                      key: 'c',
                      label: t('profile.billing'),
                      children: t('person.jonas'),
                    },
                    {
                      key: 'd',
                      label: t('profile.technical'),
                      children: t('person.li'),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
