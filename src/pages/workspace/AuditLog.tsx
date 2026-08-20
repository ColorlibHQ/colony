import { DownloadOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { auditLog, type AuditEntry } from '@/mocks/workspace';

const SEVERITY = {
  info: { color: 'default', badge: 'default' },
  warning: { color: 'warning', badge: 'warning' },
  critical: { color: 'error', badge: 'error' },
} as const;

export default function AuditLogPage() {
  const { t, i18n } = useTranslation();
  const [severity, setSeverity] = useState<string[]>([]);
  const [actor, setActor] = useState<string[]>([]);
  const [selected, setSelected] = useState<AuditEntry | null>(null);

  const rel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });
  const ago = (m: number) =>
    m < 60
      ? rel.format(-m, 'minute')
      : m < 1440
        ? rel.format(-Math.round(m / 60), 'hour')
        : rel.format(-Math.round(m / 1440), 'day');

  const rows = useMemo(
    () =>
      auditLog.filter(
        (e) =>
          (severity.length === 0 || severity.includes(e.severity)) &&
          (actor.length === 0 || actor.includes(e.actor)),
      ),
    [severity, actor],
  );

  const columns: TableColumnsType<AuditEntry> = [
    {
      title: t('audit.when'),
      dataIndex: 'minutesAgo',
      width: 130,
      render: (m: number) => ago(m),
    },
    {
      title: t('audit.actor'),
      dataIndex: 'actor',
      render: (a: string) => t(`person.${a}`),
    },
    {
      title: t('audit.action'),
      dataIndex: 'actionKey',
      render: (k: string) => t(`auditAction.${k}`),
    },
    {
      title: t('audit.target'),
      dataIndex: 'target',
      responsive: ['md'],
      render: (v: string) => (
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
        >
          {v}
        </span>
      ),
    },
    {
      title: t('audit.severity'),
      dataIndex: 'severity',
      width: 120,
      render: (s: AuditEntry['severity']) => (
        <Tag color={SEVERITY[s].color}>{t(`severity.${s}`)}</Tag>
      ),
    },
    {
      title: '',
      key: 'x',
      align: 'right',
      width: 90,
      render: (_v, row) => (
        <Button type="link" size="small" onClick={() => setSelected(row)}>
          {t('audit.details')}
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.audit')}
        description={t('page.auditDesc')}
        extra={
          <Button icon={<DownloadOutlined />}>{t('action.export')}</Button>
        }
      />

      <Card
        styles={{ body: { padding: 0 } }}
        title={
          <Space wrap>
            <Select
              mode="multiple"
              allowClear
              value={severity}
              onChange={setSeverity}
              placeholder={t('audit.severity')}
              style={{ minWidth: 180 }}
              maxTagCount="responsive"
              options={(['info', 'warning', 'critical'] as const).map((s) => ({
                value: s,
                label: t(`severity.${s}`),
              }))}
            />
            <Select
              mode="multiple"
              allowClear
              value={actor}
              onChange={setActor}
              placeholder={t('audit.actor')}
              style={{ minWidth: 180 }}
              maxTagCount="responsive"
              options={(['wei', 'marta', 'jonas', 'li', 'ana'] as const).map(
                (a) => ({
                  value: a,
                  label: t(`person.${a}`),
                }),
              )}
            />
            <DatePicker.RangePicker />
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
          size="small"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        width={480}
        title={selected ? t(`auditAction.${selected.actionKey}`) : undefined}
      >
        {selected && (
          <Descriptions
            column={1}
            bordered
            size="small"
            items={[
              {
                key: '1',
                label: t('audit.actor'),
                children: t(`person.${selected.actor}`),
              },
              { key: '2', label: t('audit.target'), children: selected.target },
              {
                key: '3',
                label: t('audit.when'),
                children: ago(selected.minutesAgo),
              },
              { key: '4', label: 'IP', children: selected.ip },
              {
                key: '5',
                label: t('audit.severity'),
                children: (
                  <Badge
                    status={SEVERITY[selected.severity].badge}
                    text={t(`severity.${selected.severity}`)}
                  />
                ),
              },
              // A change entry without its before/after is not auditable — it
              // records that something happened, not what.
              ...(selected.before
                ? [
                    {
                      key: '6',
                      label: t('audit.before'),
                      children: selected.before,
                    },
                    {
                      key: '7',
                      label: t('audit.after'),
                      children: selected.after ?? '—',
                    },
                  ]
                : []),
            ]}
          />
        )}
      </Drawer>
    </>
  );
}
