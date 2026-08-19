import {
  BookOutlined,
  BugOutlined,
  RocketOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Tag,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { activityFeed, projects } from '@/mocks/data';

const QUICK_LINKS = [
  { key: 'deploy', icon: <RocketOutlined /> },
  { key: 'issues', icon: <BugOutlined /> },
  { key: 'docs', icon: <BookOutlined /> },
  { key: 'team', icon: <TeamOutlined /> },
] as const;

const TEAM = ['wei', 'marta', 'jonas', 'li', 'ana'] as const;

export default function WorkplacePage() {
  const { t, i18n } = useTranslation();
  const relTime = new Intl.RelativeTimeFormat(i18n.language, {
    numeric: 'auto',
  });

  return (
    <>
      <PageHeader
        title={t('page.workplaceGreeting')}
        description={t('page.workplaceDesc')}
        extra={
          <Space>
            <Button>{t('action.refresh')}</Button>
            <Button type="primary">{t('action.create')}</Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title={t('workplace.projects')}
            styles={{ body: { padding: 0 } }}
          >
            <List
              dataSource={projects}
              renderItem={(p) => (
                <List.Item style={{ padding: 'var(--space-4) var(--space-5)' }}>
                  <List.Item.Meta
                    title={t(`project.${p.nameKey}`)}
                    description={
                      <Space size={12} wrap>
                        <span style={{ fontSize: 'var(--text-xs)' }}>
                          <TeamOutlined /> {p.members}
                        </span>
                        <Tag color={p.dueInDays <= 7 ? 'warning' : 'default'}>
                          {t('workplace.dueIn', { days: p.dueInDays })}
                        </Tag>
                      </Space>
                    }
                  />
                  <div style={{ width: 160 }}>
                    <Progress percent={p.progress} size="small" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title={t('workplace.quickLinks')}>
              <Row gutter={[12, 12]}>
                {QUICK_LINKS.map((link) => (
                  <Col span={12} key={link.key}>
                    <Button
                      block
                      style={{
                        height: 'auto',
                        paddingBlock: 'var(--space-3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{link.icon}</span>
                      <span style={{ fontSize: 'var(--text-xs)' }}>
                        {t(`quickLink.${link.key}`)}
                      </span>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>

            <Card title={t('workplace.team')}>
              <Avatar.Group max={{ count: 4 }} size="large">
                {TEAM.map((m) => (
                  <Avatar
                    key={m}
                    style={{ background: 'var(--ant-color-primary)' }}
                  >
                    {t(`person.${m}`).charAt(0)}
                  </Avatar>
                ))}
              </Avatar.Group>
            </Card>
          </Space>
        </Col>

        <Col xs={24}>
          <Card title={t('workplace.recentActivity')}>
            <List
              dataSource={activityFeed.slice(0, 4)}
              renderItem={(a) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          background: 'var(--c-surface-sunken)',
                          color: 'var(--c-text-secondary)',
                        }}
                      >
                        {t(`person.${a.actorKey}`).charAt(0)}
                      </Avatar>
                    }
                    title={`${t(`person.${a.actorKey}`)} ${t(`activity.${a.actionKey}`)} ${a.target}`}
                    description={relTime.format(-a.minutesAgo, 'minute')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
