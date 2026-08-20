import {
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { App, Button, Select, Space, Tag } from 'antd';
import type { TableProps } from 'antd';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/data-table/DataTable';
import {
  CUSTOMERS_EN,
  CUSTOMERS_ZH,
  type Order,
  type OrderChannel,
  type OrderPage,
  type OrderStatus,
} from '@/mocks/orders';

const STATUS_COLOR: Record<OrderStatus, string> = {
  paid: 'success',
  pending: 'processing',
  refunded: 'warning',
  failed: 'error',
};

const ALL_STATUSES: OrderStatus[] = ['paid', 'pending', 'refunded', 'failed'];
const ALL_CHANNELS: OrderChannel[] = [
  'direct',
  'organic',
  'referral',
  'social',
  'email',
];

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus[]>([]);
  const [channel, setChannel] = useState<OrderChannel[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>();

  const isZh = i18n.language === 'zh-CN';
  /** Customer names come from a parallel pool indexed by the same seed, so a
   *  row keeps its identity across a locale switch. */
  const nameOf = (o: Order) =>
    (isZh ? CUSTOMERS_ZH : CUSTOMERS_EN)[o.customerSeed]!;

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: isZh ? 'CNY' : 'USD',
        maximumFractionDigits: 0,
      }),
    [i18n.language, isZh],
  );
  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }),
    [i18n.language],
  );

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set('page', String(page));
    p.set('pageSize', String(pageSize));
    if (search) p.set('search', search);
    status.forEach((s) => p.append('status', s));
    channel.forEach((c) => p.append('channel', c));
    if (sortBy && sortDir) {
      p.set('sortBy', sortBy);
      p.set('sortDir', sortDir);
    }
    return p;
  }, [page, pageSize, search, status, channel, sortBy, sortDir]);

  const { data, isFetching } = useQuery<OrderPage>({
    queryKey: ['orders', params.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load orders');
      return res.json() as Promise<OrderPage>;
    },
    // Keeps the previous page rendered while the next one loads, so paging does
    // not flash an empty table.
    placeholderData: keepPreviousData,
  });

  const columns: DataTableColumn<Order>[] = [
    {
      key: 'reference',
      title: t('table.reference'),
      exportValue: (o) => o.reference,
      column: {
        title: t('table.reference'),
        dataIndex: 'reference',
        sorter: true,
        render: (v: string) => (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
            }}
          >
            {v}
          </span>
        ),
      },
    },
    {
      key: 'customer',
      title: t('table.customer'),
      exportValue: (o) => nameOf(o),
      column: {
        title: t('table.customer'),
        key: 'customer',
        render: (_: unknown, o: Order) => nameOf(o),
      },
    },
    {
      key: 'status',
      title: t('table.status'),
      exportValue: (o) => t(`orderStatus.${o.status}`),
      column: {
        title: t('table.status'),
        dataIndex: 'status',
        render: (s: OrderStatus) => (
          <Tag color={STATUS_COLOR[s]}>{t(`orderStatus.${s}`)}</Tag>
        ),
      },
    },
    {
      key: 'channel',
      title: t('table.channel'),
      exportValue: (o) => t(`channel.${o.channel}`),
      column: {
        title: t('table.channel'),
        dataIndex: 'channel',
        responsive: ['lg'],
        render: (c: OrderChannel) => t(`channel.${c}`),
      },
    },
    {
      key: 'items',
      title: t('table.items'),
      exportValue: (o) => o.items,
      column: {
        title: t('table.items'),
        dataIndex: 'items',
        align: 'right',
        responsive: ['md'],
        sorter: true,
      },
    },
    {
      key: 'amount',
      title: t('table.amount'),
      exportValue: (o) => o.amount,
      column: {
        title: t('table.amount'),
        dataIndex: 'amount',
        align: 'right',
        sorter: true,
        render: (v: number) => currency.format(v),
      },
    },
    {
      key: 'createdAt',
      title: t('table.created'),
      exportValue: (o) => o.createdAt,
      column: {
        title: t('table.created'),
        dataIndex: 'createdAt',
        sorter: true,
        responsive: ['lg'],
        render: (v: string) => dateFmt.format(new Date(v)),
      },
    },
    {
      key: 'actions',
      title: t('table.actions'),
      locked: true,
      column: {
        title: '',
        key: 'actions',
        align: 'right',
        render: () => (
          <Button type="link" size="small">
            {t('action.edit')}
          </Button>
        ),
      },
    },
  ];

  const handleTableChange: TableProps<Order>['onChange'] = (_p, _f, sorter) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s?.order && s.field) {
      setSortBy(String(s.field));
      setSortDir(s.order === 'ascend' ? 'asc' : 'desc');
    } else {
      setSortBy(undefined);
      setSortDir(undefined);
    }
  };

  /** Any filter change must reset to page 1 — staying on page 12 of a
   *  three-page result set renders an empty table with no explanation. */
  const withPageReset =
    <T,>(setter: (v: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  return (
    <>
      <PageHeader
        title={t('nav.table')}
        description={t('page.ordersDesc')}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            {t('action.create')}
          </Button>
        }
      />

      <DataTable<Order>
        rows={data?.rows ?? []}
        total={data?.total ?? 0}
        loading={isFetching}
        rowKey={(o) => o.id}
        columns={columns}
        page={page}
        pageSize={pageSize}
        onPageChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        search={search}
        onSearchChange={withPageReset(setSearch)}
        onRefresh={() => {
          void queryClient.invalidateQueries({ queryKey: ['orders'] });
        }}
        onTableChange={handleTableChange}
        exportFilename="colony-orders.csv"
        filters={
          <>
            <Select
              mode="multiple"
              allowClear
              value={status}
              onChange={withPageReset(setStatus)}
              placeholder={t('table.status')}
              style={{ minWidth: 180 }}
              maxTagCount="responsive"
              options={ALL_STATUSES.map((s) => ({
                value: s,
                // Facet counts describe the whole filtered set, not this page.
                label: `${t(`orderStatus.${s}`)} (${data?.facets[s] ?? 0})`,
              }))}
            />
            <Select
              mode="multiple"
              allowClear
              value={channel}
              onChange={withPageReset(setChannel)}
              placeholder={t('table.channel')}
              style={{ minWidth: 170 }}
              maxTagCount="responsive"
              options={ALL_CHANNELS.map((c) => ({
                value: c,
                label: t(`channel.${c}`),
              }))}
            />
          </>
        }
        bulkActions={(selected, clear) => (
          <Space>
            <Button
              size="small"
              icon={<ExportOutlined />}
              onClick={() => {
                void message.success(
                  t('table.bulkExported', { count: selected.length }),
                );
              }}
            >
              {t('action.export')}
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                void message.success(
                  t('table.bulkDeleted', { count: selected.length }),
                );
                clear();
              }}
            >
              {t('action.delete')}
            </Button>
          </Space>
        )}
      />
    </>
  );
}
