import {
  CheckOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Dropdown,
  Input,
  InputNumber,
  Progress,
  Radio,
  Rate,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  Tag,
  Timeline,
  Tooltip,
  Tree,
  Upload,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import {
  ShowcaseSection,
  ShowcaseStack,
} from '@/components/common/ShowcaseSection';

export default function ElementsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('nav.elements')}
        description={t('page.elementsDesc')}
      />

      <ShowcaseSection
        title={t('elements.buttons')}
        description={t('elements.buttonsDesc')}
      >
        <Button type="primary">{t('action.submit')}</Button>
        <Button>{t('action.cancel')}</Button>
        <Button type="dashed" icon={<PlusOutlined />}>
          {t('action.create')}
        </Button>
        <Button type="link">{t('action.edit')}</Button>
        <Button type="text">{t('action.close')}</Button>
        <Button danger icon={<DeleteOutlined />}>
          {t('action.delete')}
        </Button>
        <Button type="primary" loading>
          {t('state.loading')}
        </Button>
        <Button type="primary" disabled>
          {t('elements.disabled')}
        </Button>
        <Button shape="circle" icon={<SearchOutlined />} />
        <Button type="primary" shape="round" icon={<CloudDownloadOutlined />}>
          {t('action.export')}
        </Button>
        <Dropdown
          menu={{
            items: [
              { key: 'a', label: t('action.edit'), icon: <EditOutlined /> },
              { key: 'b', label: t('action.export') },
              { type: 'divider' },
              { key: 'c', label: t('action.delete'), danger: true },
            ],
          }}
        >
          <Button icon={<SettingOutlined />}>
            {t('elements.moreActions')}
          </Button>
        </Dropdown>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('elements.sizes')}
        description={t('elements.sizesDesc')}
      >
        <Button type="primary" size="large">
          {t('elements.large')}
        </Button>
        <Button type="primary">{t('elements.medium')}</Button>
        <Button type="primary" size="small">
          {t('elements.small')}
        </Button>
        <Divider type="vertical" style={{ height: 28 }} />
        <Input placeholder={t('action.search')} style={{ width: 180 }} />
        <Select
          defaultValue="all"
          style={{ width: 160 }}
          options={[
            { value: 'all', label: t('elements.optAll') },
            { value: 'active', label: t('status.active') },
            { value: 'draft', label: t('status.draft') },
          ]}
        />
        <InputNumber defaultValue={42} />
        <DatePicker />
      </ShowcaseSection>

      <ShowcaseSection
        title={t('elements.tags')}
        description={t('elements.tagsDesc')}
      >
        <Tag>{t('elements.default')}</Tag>
        <Tag color="success">{t('serviceStatus.healthy')}</Tag>
        <Tag color="warning">{t('serviceStatus.degraded')}</Tag>
        <Tag color="error">{t('serviceStatus.down')}</Tag>
        <Tag color="processing">{t('elements.inProgress')}</Tag>
        <Tag bordered={false} color="success">
          {t('status.active')}
        </Tag>
        <Tag icon={<CheckOutlined />} color="success">
          {t('state.saved')}
        </Tag>
        <Tag closable>{t('elements.closable')}</Tag>
        <Divider type="vertical" style={{ height: 28 }} />
        <Badge count={5}>
          <Avatar shape="square" icon={<UserOutlined />} />
        </Badge>
        <Badge dot>
          <Avatar shape="square" icon={<SettingOutlined />} />
        </Badge>
        <Badge count={0} showZero color="var(--c-text-tertiary)">
          <Avatar shape="square" icon={<HeartOutlined />} />
        </Badge>
        <Badge status="success" text={t('serviceStatus.healthy')} />
        <Badge status="processing" text={t('elements.inProgress')} />
        <Badge status="error" text={t('serviceStatus.down')} />
      </ShowcaseSection>

      <ShowcaseSection
        title={t('elements.avatars')}
        description={t('elements.avatarsDesc')}
      >
        <Avatar size="large" style={{ background: 'var(--ant-color-primary)' }}>
          A
        </Avatar>
        <Avatar icon={<UserOutlined />} />
        <Avatar shape="square" icon={<UserOutlined />} />
        <Avatar.Group max={{ count: 3 }}>
          <Avatar style={{ background: 'var(--ant-color-primary)' }}>W</Avatar>
          <Avatar style={{ background: 'var(--c-success)' }}>M</Avatar>
          <Avatar style={{ background: 'var(--c-warning)' }}>J</Avatar>
          <Avatar style={{ background: 'var(--c-danger)' }}>L</Avatar>
          <Avatar style={{ background: 'var(--c-text-tertiary)' }}>A</Avatar>
        </Avatar.Group>
        <Divider type="vertical" style={{ height: 28 }} />
        <Rate defaultValue={4} />
        <Rate character={<StarOutlined />} defaultValue={3} />
      </ShowcaseSection>

      <ShowcaseSection
        title={t('elements.controls')}
        description={t('elements.controlsDesc')}
      >
        <Switch defaultChecked />
        <Switch
          defaultChecked
          checkedChildren={t('theme.mode.dark')}
          unCheckedChildren={t('theme.mode.light')}
        />
        <Switch disabled />
        <Divider type="vertical" style={{ height: 28 }} />
        <Checkbox defaultChecked>{t('elements.optAll')}</Checkbox>
        <Radio.Group
          defaultValue="a"
          options={[
            { value: 'a', label: t('elements.large') },
            { value: 'b', label: t('elements.medium') },
            { value: 'c', label: t('elements.small') },
          ]}
        />
        <Segmented
          options={[
            { value: 'list', label: t('nav.lists') },
            { value: 'table', label: t('nav.table') },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseStack
        title={t('elements.progress')}
        description={t('elements.progressDesc')}
      >
        <Progress percent={30} />
        <Progress percent={64} status="active" />
        <Progress percent={91} status="exception" />
        <Progress percent={100} />
        <Space size={24} wrap>
          <Progress type="circle" percent={72} size={80} />
          <Progress type="circle" percent={91} status="exception" size={80} />
          <Progress type="dashboard" percent={58} size={80} />
        </Space>
        <Slider defaultValue={38} />
        <Slider range defaultValue={[18, 62]} />
      </ShowcaseStack>

      <ShowcaseStack
        title={t('elements.timelineTree')}
        description={t('elements.timelineTreeDesc')}
      >
        <Space size={48} align="start" wrap>
          <Timeline
            items={[
              { color: 'green', children: t('timeline.created') },
              { color: 'blue', children: t('timeline.reviewed') },
              { color: 'red', children: t('timeline.blocked') },
              { children: t('timeline.shipped') },
            ]}
          />
          <Tree
            defaultExpandAll
            treeData={[
              {
                title: 'src',
                key: 'src',
                children: [
                  { title: 'components', key: 'c' },
                  { title: 'pages', key: 'p' },
                  {
                    title: 'i18n',
                    key: 'i',
                    children: [
                      { title: 'en-US', key: 'en' },
                      { title: 'zh-CN', key: 'zh' },
                    ],
                  },
                ],
              },
            ]}
          />
          <Space direction="vertical">
            <Upload>
              <Button icon={<PlusOutlined />}>{t('elements.upload')}</Button>
            </Upload>
            <Tooltip title={t('elements.tooltipHint')}>
              <Button type="dashed">{t('elements.hoverMe')}</Button>
            </Tooltip>
          </Space>
        </Space>
      </ShowcaseStack>
    </>
  );
}
