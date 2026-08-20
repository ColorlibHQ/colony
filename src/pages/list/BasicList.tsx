import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Input,
  List,
  Progress,
  Radio,
  Space,
  Tag,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { projects } from '@/mocks/data';

type Filter = 'all' | 'active' | 'done';

export default function BasicListPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (q && !t(`project.${p.nameKey}`).toLowerCase().includes(q))
        return false;
      if (filter === 'active') return p.progress < 100;
      if (filter === 'done') return p.progress >= 100;
      return true;
    });
  }, [filter, query, t]);

  const counts = useMemo(
    () => ({
      all: projects.length,
      active: projects.filter((p) => p.progress < 100).length,
      done: projects.filter((p) => p.progress >= 100).length,
    }),
    [],
  );

  return (
    <>
      <PageHeader
        title={t('nav.basicList')}
        description={t('page.basicListDesc')}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            {t('action.create')}
          </Button>
        }
      />

      <Card styles={{ body: { padding: 0 } }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--c-border-soft)',
          }}
        >
          <Radio.Group
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            optionType="button"
            options={[
              { value: 'all', label: `${t('list.filterAll')} (${counts.all})` },
              {
                value: 'active',
                label: `${t('list.filterActive')} (${counts.active})`,
              },
              {
                value: 'done',
                label: `${t('list.filterDone')} (${counts.done})`,
              },
            ]}
          />
          <Input.Search
            allowClear
            placeholder={t('list.searchPlaceholder')}
            style={{ width: 240 }}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <List
          dataSource={visible}
          locale={{ emptyText: t('list.noMatches') }}
          pagination={
            visible.length > 5 ? { pageSize: 5, align: 'center' } : false
          }
          renderItem={(p) => (
            <List.Item
              style={{ padding: 'var(--space-4) var(--space-5)' }}
              actions={[
                <Button key="e" type="link">
                  {t('action.edit')}
                </Button>,
                <Dropdown
                  key="m"
                  menu={{
                    items: [
                      { key: 'x', label: t('action.export') },
                      { type: 'divider' },
                      { key: 'd', label: t('action.delete'), danger: true },
                    ],
                  }}
                >
                  <Button type="link">{t('elements.moreActions')}</Button>
                </Dropdown>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={40}
                    style={{ background: 'var(--ant-color-primary)' }}
                  >
                    {t(`project.${p.nameKey}`).charAt(0)}
                  </Avatar>
                }
                title={
                  <Space size={8}>
                    {t(`project.${p.nameKey}`)}
                    {p.progress >= 100 ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        {t('list.filterDone')}
                      </Tag>
                    ) : (
                      <Tag
                        icon={<ClockCircleOutlined />}
                        color={p.dueInDays <= 7 ? 'warning' : 'default'}
                      >
                        {t('workplace.dueIn', { days: p.dueInDays })}
                      </Tag>
                    )}
                  </Space>
                }
                description={t('list.membersCount', { count: p.members })}
              />
              <div style={{ width: 180 }}>
                <Progress percent={p.progress} size="small" />
              </div>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
}
