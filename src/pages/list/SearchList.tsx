import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Empty,
  Input,
  List,
  Select,
  Space,
  Tabs,
  Tag,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { articles } from '@/mocks/content';

export default function SearchListPage() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState('articles');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'recent' | 'popular'>('popular');

  const num = useMemo(
    () => new Intl.NumberFormat(i18n.language),
    [i18n.language],
  );
  const rel = useMemo(
    () => new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' }),
    [i18n.language],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles
      .filter((a) => !q || t(`article.${a.key}`).toLowerCase().includes(q))
      .toSorted((a, b) =>
        sort === 'popular' ? b.likes - a.likes : a.daysAgo - b.daysAgo,
      );
  }, [query, sort, t]);

  const metric = (icon: React.ReactNode, value: number, label: string) => (
    <Space
      size={4}
      style={{ color: 'var(--c-text-tertiary)', fontSize: 'var(--text-xs)' }}
    >
      <span aria-hidden="true">{icon}</span>
      <span aria-label={label} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {num.format(value)}
      </span>
    </Space>
  );

  return (
    <>
      <PageHeader
        title={t('nav.searchList')}
        description={t('page.searchListDesc')}
      />

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Input.Search
            size="large"
            allowClear
            placeholder={t('list.searchArticles')}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Space
            wrap
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Tabs
              activeKey={tab}
              onChange={setTab}
              items={[
                { key: 'articles', label: t('list.tabArticles') },
                { key: 'projects', label: t('list.tabProjects') },
                { key: 'applications', label: t('list.tabApplications') },
              ]}
              style={{ marginBottom: -16 }}
            />
            <Select
              value={sort}
              style={{ width: 160 }}
              onChange={setSort}
              options={[
                { value: 'popular', label: t('list.sortPopular') },
                { value: 'recent', label: t('list.sortRecent') },
              ]}
            />
          </Space>
        </Space>
      </Card>

      <Card styles={{ body: { padding: visible.length ? 0 : undefined } }}>
        {visible.length === 0 ? (
          <Empty description={t('list.noMatches')} />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={visible}
            pagination={{ pageSize: 5, align: 'center' }}
            renderItem={(a) => (
              <List.Item
                key={a.key}
                style={{ padding: 'var(--space-5)' }}
                actions={[
                  metric(<StarOutlined />, a.stars, t('list.stars')),
                  metric(<LikeOutlined />, a.likes, t('list.likes')),
                  metric(<MessageOutlined />, a.comments, t('list.comments')),
                  metric(<EyeOutlined />, a.views, t('list.views')),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={44}
                      style={{ background: 'var(--ant-color-primary)' }}
                    >
                      {t(`article.${a.key}`).charAt(0)}
                    </Avatar>
                  }
                  title={t(`article.${a.key}`)}
                  description={
                    <Space wrap size={6}>
                      {a.tags.map((tg) => (
                        <Tag key={tg} bordered={false}>
                          {t(`tag.${tg}`)}
                        </Tag>
                      ))}
                      <span
                        style={{
                          color: 'var(--c-text-tertiary)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {t('person.' + a.author)} ·{' '}
                        {rel.format(-a.daysAgo, 'day')}
                      </span>
                    </Space>
                  }
                />
                <p
                  style={{
                    margin: 0,
                    color: 'var(--c-text-secondary)',
                    maxWidth: '68ch',
                  }}
                >
                  {t(`articleBody.${a.key}`)}
                </p>
              </List.Item>
            )}
          />
        )}
      </Card>
    </>
  );
}
