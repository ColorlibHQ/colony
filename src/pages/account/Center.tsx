import {
  EnvironmentOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Tabs,
  Tag,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { activityFeed, projects } from '@/mocks/data';
import { articles } from '@/mocks/content';

const SKILLS = ['react', 'antd', 'typography', 'performance', 'i18n'] as const;

export default function AccountCenterPage() {
  const { t, i18n } = useTranslation();
  const rel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

  return (
    <>
      <PageHeader
        title={t('nav.accountCenter')}
        description={t('page.accountCenterDesc')}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={7}>
          <Card>
            <Space
              direction="vertical"
              align="center"
              style={{ width: '100%' }}
              size={12}
            >
              <Avatar
                size={80}
                style={{ background: 'var(--ant-color-primary)', fontSize: 32 }}
              >
                A
              </Avatar>
              <Space direction="vertical" align="center" size={2}>
                <strong style={{ fontSize: 'var(--text-md)' }}>
                  Aigars Silkalns
                </strong>
                <span style={{ color: 'var(--c-text-secondary)' }}>
                  {t('cards.profileRole')}
                </span>
              </Space>
            </Space>

            <Divider />

            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <Space>
                <TeamOutlined style={{ color: 'var(--c-text-tertiary)' }} />
                {t('team.engineering')}
              </Space>
              <Space>
                <MailOutlined style={{ color: 'var(--c-text-tertiary)' }} />
                aigars@colorlib.com
              </Space>
              <Space>
                <EnvironmentOutlined
                  style={{ color: 'var(--c-text-tertiary)' }}
                />
                {t('region.emea')}
              </Space>
            </Space>

            <Divider />

            <div style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}>
              {t('account.skills')}
            </div>
            <Space wrap size={6}>
              {SKILLS.map((s) => (
                <Tag key={s} bordered={false}>
                  {t(`tag.${s}`)}
                </Tag>
              ))}
            </Space>

            <Divider />

            <div style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}>
              {t('account.profileStrength')}
            </div>
            <Progress percent={78} />
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--c-text-tertiary)',
              }}
            >
              {t('account.profileStrengthHint')}
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={17}>
          <Card styles={{ body: { paddingTop: 0 } }}>
            <Tabs
              items={[
                {
                  key: 'articles',
                  label: t('account.tabArticles'),
                  children: (
                    <List
                      dataSource={articles.slice(0, 5)}
                      renderItem={(a) => (
                        <List.Item>
                          <List.Item.Meta
                            title={t(`article.${a.key}`)}
                            description={
                              <Space size={6} wrap>
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
                                  {rel.format(-a.daysAgo, 'day')}
                                </span>
                              </Space>
                            }
                          />
                          <span
                            style={{
                              color: 'var(--c-text-tertiary)',
                              fontSize: 'var(--text-xs)',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {a.likes} {t('list.likes')}
                          </span>
                        </List.Item>
                      )}
                    />
                  ),
                },
                {
                  key: 'projects',
                  label: t('account.tabProjects'),
                  children: (
                    <List
                      dataSource={projects}
                      renderItem={(p) => (
                        <List.Item>
                          <List.Item.Meta
                            title={t(`project.${p.nameKey}`)}
                            description={t('list.membersCount', {
                              count: p.members,
                            })}
                          />
                          <div style={{ width: 160 }}>
                            <Progress percent={p.progress} size="small" />
                          </div>
                        </List.Item>
                      )}
                    />
                  ),
                },
                {
                  key: 'activity',
                  label: t('account.tabActivity'),
                  children: (
                    <List
                      dataSource={activityFeed}
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
                            description={rel.format(-a.minutesAgo, 'minute')}
                          />
                        </List.Item>
                      )}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
