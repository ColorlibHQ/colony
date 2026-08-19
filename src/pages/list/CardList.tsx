import {
  AppstoreOutlined,
  BarsOutlined,
  EllipsisOutlined,
  PlusOutlined,
  StarFilled,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Input,
  List,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { projects } from '@/mocks/data';

type View = 'grid' | 'list';

const STATUS_OF = (progress: number) =>
  progress >= 80 ? 'nearlyDone' : progress >= 40 ? 'onTrack' : 'early';

export default function CardListPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>('grid');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'progress' | 'due'>('progress');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => !q || t(`project.${p.nameKey}`).toLowerCase().includes(q))
      .toSorted((a, b) =>
        sort === 'progress'
          ? b.progress - a.progress
          : a.dueInDays - b.dueInDays,
      );
  }, [query, sort, t]);

  const cardFor = (p: (typeof projects)[number]) => (
    <Card
      hoverable
      actions={[
        <StarFilled key="star" style={{ color: 'var(--c-warning)' }} />,
        <TeamOutlined key="team" />,
        <Dropdown
          key="more"
          menu={{
            items: [
              { key: 'e', label: t('action.edit') },
              { key: 'x', label: t('action.export') },
              { type: 'divider' },
              { key: 'd', label: t('action.delete'), danger: true },
            ],
          }}
        >
          <EllipsisOutlined />
        </Dropdown>,
      ]}
    >
      <Card.Meta
        avatar={
          <Avatar
            shape="square"
            size={44}
            style={{ background: 'var(--ant-color-primary)' }}
          >
            {t(`project.${p.nameKey}`).charAt(0)}
          </Avatar>
        }
        title={
          <Space>
            {t(`project.${p.nameKey}`)}
            <Tag color={p.dueInDays <= 7 ? 'warning' : 'default'}>
              {t('workplace.dueIn', { days: p.dueInDays })}
            </Tag>
          </Space>
        }
        description={t(`listStatus.${STATUS_OF(p.progress)}`)}
      />
      <div style={{ marginTop: 'var(--space-4)' }}>
        <Progress percent={p.progress} size="small" />
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 'var(--space-2)',
          }}
        >
          <Avatar.Group max={{ count: 3 }} size="small">
            {Array.from({ length: p.members }, (_, i) => (
              <Avatar key={i} size="small">
                {String.fromCharCode(65 + i)}
              </Avatar>
            ))}
          </Avatar.Group>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--c-text-tertiary)',
            }}
          >
            {t('list.membersCount', { count: p.members })}
          </span>
        </Space>
      </div>
    </Card>
  );

  return (
    <>
      <PageHeader
        title={t('nav.cardList')}
        description={t('page.cardListDesc')}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            {t('action.create')}
          </Button>
        }
      />

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input.Search
              allowClear
              placeholder={t('list.searchPlaceholder')}
              style={{ width: 260 }}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select
              value={sort}
              style={{ width: 180 }}
              onChange={setSort}
              options={[
                { value: 'progress', label: t('list.sortProgress') },
                { value: 'due', label: t('list.sortDue') },
              ]}
            />
          </Space>
          <Segmented
            value={view}
            onChange={(v) => setView(v as View)}
            options={[
              {
                value: 'grid',
                icon: <AppstoreOutlined />,
                label: t('list.grid'),
              },
              { value: 'list', icon: <BarsOutlined />, label: t('list.list') },
            ]}
          />
        </Space>
      </Card>

      {visible.length === 0 ? (
        <Card>
          <Empty description={t('list.noMatches')}>
            <Button onClick={() => setQuery('')}>{t('action.reset')}</Button>
          </Empty>
        </Card>
      ) : view === 'grid' ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={8}>
            <Card
              style={{
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                borderStyle: 'dashed',
                minHeight: 240,
              }}
            >
              <Button type="dashed" icon={<PlusOutlined />} size="large">
                {t('list.newProject')}
              </Button>
            </Card>
          </Col>
          {visible.map((p) => (
            <Col xs={24} sm={12} xl={8} key={p.id}>
              {cardFor(p)}
            </Col>
          ))}
        </Row>
      ) : (
        <Card styles={{ body: { padding: 0 } }}>
          <List
            dataSource={visible}
            renderItem={(p) => (
              <List.Item
                style={{ padding: 'var(--space-4) var(--space-5)' }}
                actions={[
                  <Button key="e" type="link">
                    {t('action.edit')}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      style={{ background: 'var(--ant-color-primary)' }}
                    >
                      {t(`project.${p.nameKey}`).charAt(0)}
                    </Avatar>
                  }
                  title={t(`project.${p.nameKey}`)}
                  description={t(`listStatus.${STATUS_OF(p.progress)}`)}
                />
                <div style={{ width: 200 }}>
                  <Progress percent={p.progress} size="small" />
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </>
  );
}
