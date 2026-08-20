import {
  BellOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  CreditCardOutlined,
  MessageOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Empty,
  List,
  Segmented,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import {
  notifications as seed,
  type Notification,
  type NotificationKind,
} from '@/mocks/workspace';

const ICONS: Record<NotificationKind, ReactNode> = {
  deploy: <CloudUploadOutlined />,
  mention: <MessageOutlined />,
  security: <SafetyOutlined />,
  billing: <CreditCardOutlined />,
};

const TONE: Record<NotificationKind, string> = {
  deploy: 'var(--ant-color-primary)',
  mention: 'var(--c-success)',
  security: 'var(--c-danger)',
  billing: 'var(--c-warning)',
};

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Notification[]>(seed);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const rel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });
  const ago = (m: number) =>
    m < 60
      ? rel.format(-m, 'minute')
      : m < 1440
        ? rel.format(-Math.round(m / 60), 'hour')
        : rel.format(-Math.round(m / 1440), 'day');

  const unread = items.filter((n) => !n.read).length;
  const visible = useMemo(
    () => (filter === 'unread' ? items.filter((n) => !n.read) : items),
    [items, filter],
  );

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <>
      <PageHeader
        title={t('nav.notifications')}
        description={t('page.notificationsDesc')}
        extra={
          <Space>
            <Segmented
              value={filter}
              onChange={(v) => setFilter(v as 'all' | 'unread')}
              options={[
                { value: 'all', label: t('notifications.all') },
                {
                  value: 'unread',
                  label: `${t('notifications.unread')} (${unread})`,
                },
              ]}
            />
            <Button
              icon={<CheckOutlined />}
              disabled={unread === 0}
              onClick={markAllRead}
            >
              {t('notifications.markAllRead')}
            </Button>
          </Space>
        }
      />

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Card
          style={{ flex: '2 1 420px', minWidth: 320 }}
          styles={{ body: { padding: 0 } }}
          title={
            <Space>
              <BellOutlined />
              {t('nav.notifications')}
              <Badge count={unread} />
            </Space>
          }
        >
          {visible.length === 0 ? (
            <Empty
              description={t('notifications.allCaughtUp')}
              style={{ padding: 'var(--space-10) 0' }}
            />
          ) : (
            <List
              dataSource={visible}
              renderItem={(n) => (
                <List.Item
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    background: n.read ? undefined : 'var(--c-surface-sunken)',
                  }}
                  actions={
                    n.read
                      ? []
                      : [
                          <Button
                            key="r"
                            type="link"
                            size="small"
                            onClick={() =>
                              setItems((p) =>
                                p.map((x) =>
                                  x.id === n.id ? { ...x, read: true } : x,
                                ),
                              )
                            }
                          >
                            {t('notifications.markRead')}
                          </Button>,
                        ]
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'grid',
                          placeItems: 'center',
                          width: 34,
                          height: 34,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--c-surface-sunken)',
                          color: TONE[n.kind],
                        }}
                      >
                        {ICONS[n.kind]}
                      </span>
                    }
                    title={
                      <Space size={8}>
                        <span style={{ fontWeight: n.read ? 400 : 600 }}>
                          {t(`notification.${n.titleKey}.title`)}
                        </span>
                        <Tag bordered={false}>
                          {t(`notificationKind.${n.kind}`)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={2}>
                        <span>{t(`notification.${n.bodyKey}.body`)}</span>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 'var(--text-xs)' }}
                        >
                          {ago(n.minutesAgo)}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card
          style={{ flex: '1 1 260px', minWidth: 260 }}
          title={t('settings.notifications')}
        >
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {(
              ['deploy', 'mention', 'security', 'billing'] as NotificationKind[]
            ).map((k) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                }}
              >
                <Space>
                  <span style={{ color: TONE[k] }}>{ICONS[k]}</span>
                  {t(`notificationKind.${k}`)}
                </Space>
                <Switch defaultChecked={k !== 'billing'} />
              </div>
            ))}
          </Space>
        </Card>
      </div>
    </>
  );
}
