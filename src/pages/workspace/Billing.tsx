import {
  CreditCardOutlined,
  DownloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { invoices, type Invoice } from '@/mocks/workspace';

const STATUS = { paid: 'success', due: 'warning', failed: 'error' } as const;

export default function BillingPage() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';
  const currency = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: isZh ? 'CNY' : 'USD',
    maximumFractionDigits: 0,
  });
  const rel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

  const failed = invoices.find((i) => i.status === 'failed');

  const columns: TableColumnsType<Invoice> = [
    {
      title: t('billing.invoice'),
      dataIndex: 'number',
      render: (v: string) => (
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
        >
          {v}
        </span>
      ),
    },
    {
      title: t('billing.issued'),
      dataIndex: 'daysAgo',
      responsive: ['md'],
      render: (d: number) => rel.format(-d, 'day'),
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
      render: (s: Invoice['status']) => (
        <Tag color={STATUS[s]}>{t(`invoiceStatus.${s}`)}</Tag>
      ),
    },
    {
      title: '',
      key: 'd',
      align: 'right',
      render: () => (
        <Button type="link" size="small" icon={<DownloadOutlined />}>
          PDF
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.billing')}
        description={t('page.billingDesc')}
        extra={<Button type="primary">{t('billing.changePlan')}</Button>}
      />

      {failed && (
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message={t('billing.failedTitle', { number: failed.number })}
          description={t('billing.failedDesc')}
          action={
            <Button size="small" danger>
              {t('billing.retryPayment')}
            </Button>
          }
          style={{ marginBottom: 'var(--space-4)' }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title={t('billing.currentPlan')}
              value={t('plan.team')}
            />
            <div
              style={{
                color: 'var(--c-text-secondary)',
                marginTop: 'var(--space-2)',
              }}
            >
              {currency.format(29)} {t('cards.perMonth')} ·{' '}
              {t('billing.seats', { count: 12 })}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title={t('billing.nextInvoice')}
              value={currency.format(348)}
            />
            <div
              style={{
                color: 'var(--c-text-secondary)',
                marginTop: 'var(--space-2)',
              }}
            >
              {t('billing.renewsIn', { days: 12 })}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <span
                style={{
                  color: 'var(--c-text-secondary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {t('billing.usage')}
              </span>
              <Progress percent={74} strokeLinecap="butt" />
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--c-text-tertiary)',
                }}
              >
                {t('billing.usageDetail', { used: '74,200', total: '100,000' })}
              </span>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title={t('billing.paymentMethod')}>
            <Descriptions
              column={1}
              size="small"
              items={[
                {
                  key: '1',
                  label: t('billing.card'),
                  children: (
                    <Space>
                      <CreditCardOutlined />
                      •••• 4242
                    </Space>
                  ),
                },
                {
                  key: '2',
                  label: t('billing.expires'),
                  children: '08 / 2029',
                },
                {
                  key: '3',
                  label: t('billing.billingEmail'),
                  children: 'billing@colorlib.com',
                },
              ]}
            />
            <Button block style={{ marginTop: 'var(--space-4)' }}>
              {t('billing.updateCard')}
            </Button>
          </Card>
        </Col>

        <Col xs={24} xl={16}>
          <Card title={t('billing.invoices')} styles={{ body: { padding: 0 } }}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={invoices}
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
