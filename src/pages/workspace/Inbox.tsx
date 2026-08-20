import {
  DeleteOutlined,
  InboxOutlined,
  SendOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Empty,
  Input,
  List,
  Space,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { messages as seed, type Message } from '@/mocks/workspace';

export default function InboxPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Message[]>(seed);
  const [selectedId, setSelectedId] = useState<string>(seed[0]!.id);
  const [query, setQuery] = useState('');

  const rel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });
  const ago = (min: number) =>
    min < 60
      ? rel.format(-min, 'minute')
      : min < 1440
        ? rel.format(-Math.round(min / 60), 'hour')
        : rel.format(-Math.round(min / 1440), 'day');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (m) =>
        !q ||
        t(`mail.${m.subjectKey}.subject`).toLowerCase().includes(q) ||
        t(`person.${m.from}`).toLowerCase().includes(q),
    );
  }, [items, query, t]);

  const selected = items.find((m) => m.id === selectedId);
  const unread = items.filter((m) => m.unread).length;

  const open = (m: Message) => {
    setSelectedId(m.id);
    // Opening marks read, which is what every mail client does and what the
    // unread badge has to agree with.
    setItems((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, unread: false } : x)),
    );
  };

  const toggleStar = (id: string) =>
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, starred: !x.starred } : x)),
    );

  return (
    <>
      <PageHeader
        title={t('nav.inbox')}
        description={t('page.inboxDesc')}
        extra={
          <Button type="primary" icon={<SendOutlined />}>
            {t('inbox.compose')}
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Card
          style={{ flex: '1 1 340px', minWidth: 320 }}
          styles={{ body: { padding: 0 } }}
          title={
            <Space>
              <InboxOutlined />
              {t('inbox.title')}
              <Badge count={unread} />
            </Space>
          }
        >
          <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <Input.Search
              allowClear
              placeholder={t('inbox.search')}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {visible.length === 0 ? (
            <Empty
              description={t('list.noMatches')}
              style={{ padding: 'var(--space-8) 0' }}
            />
          ) : (
            <List
              dataSource={visible}
              renderItem={(m) => (
                <List.Item
                  onClick={() => open(m)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    cursor: 'pointer',
                    background:
                      m.id === selectedId
                        ? 'var(--c-surface-sunken)'
                        : undefined,
                    borderInlineStart:
                      m.id === selectedId
                        ? '3px solid var(--ant-color-primary)'
                        : '3px solid transparent',
                  }}
                  actions={[
                    <Button
                      key="star"
                      type="text"
                      size="small"
                      aria-label={t('inbox.star')}
                      icon={
                        m.starred ? (
                          <StarFilled style={{ color: 'var(--c-warning)' }} />
                        ) : (
                          <StarOutlined />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(m.id);
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={m.unread}>
                        <Avatar
                          style={{ background: 'var(--ant-color-primary)' }}
                        >
                          {t(`person.${m.from}`).charAt(0)}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <span style={{ fontWeight: m.unread ? 600 : 400 }}>
                        {t(`mail.${m.subjectKey}.subject`)}
                      </span>
                    }
                    description={
                      <span style={{ fontSize: 'var(--text-xs)' }}>
                        {t(`person.${m.from}`)} · {ago(m.minutesAgo)}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card
          style={{ flex: '2 1 420px', minWidth: 320 }}
          title={
            selected ? t(`mail.${selected.subjectKey}.subject`) : undefined
          }
          extra={
            selected && (
              <Space>
                <Button size="small" icon={<DeleteOutlined />} danger>
                  {t('action.delete')}
                </Button>
              </Space>
            )
          }
        >
          {selected ? (
            <>
              <Space style={{ marginBottom: 'var(--space-5)' }}>
                <Avatar style={{ background: 'var(--ant-color-primary)' }}>
                  {t(`person.${selected.from}`).charAt(0)}
                </Avatar>
                <Space direction="vertical" size={0}>
                  <strong>{t(`person.${selected.from}`)}</strong>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {ago(selected.minutesAgo)}
                  </Typography.Text>
                </Space>
              </Space>
              <Typography.Paragraph style={{ maxWidth: '68ch' }}>
                {t(`mail.${selected.bodyKey}.body`)}
              </Typography.Paragraph>
              <Input.TextArea
                rows={4}
                placeholder={t('inbox.replyPlaceholder')}
                style={{ marginTop: 'var(--space-4)' }}
              />
              <Button type="primary" style={{ marginTop: 'var(--space-3)' }}>
                {t('inbox.reply')}
              </Button>
            </>
          ) : (
            <Empty description={t('inbox.nothingSelected')} />
          )}
        </Card>
      </div>
    </>
  );
}
