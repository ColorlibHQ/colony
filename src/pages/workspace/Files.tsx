import {
  AppstoreOutlined,
  BarsOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FolderFilled,
  CodeOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Input,
  List,
  Progress,
  Row,
  Segmented,
  Space,
  Table,
  Tag,
  Upload,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { files, type FileNode } from '@/mocks/workspace';

const ICONS: Record<FileNode['kind'], ReactNode> = {
  folder: <FolderFilled style={{ color: 'var(--c-warning)' }} />,
  image: <FileImageOutlined style={{ color: 'var(--ant-color-primary)' }} />,
  doc: <FileTextOutlined style={{ color: 'var(--c-text-secondary)' }} />,
  code: <CodeOutlined style={{ color: 'var(--c-success)' }} />,
  archive: <FileZipOutlined style={{ color: 'var(--c-text-tertiary)' }} />,
};

/** Bytes are for machines; people read "2.4 MB". */
function formatSize(kb: number, locale: string): string {
  if (kb === 0) return '—';
  const units = ['KB', 'MB', 'GB'];
  let value = kb;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${units[unit]}`;
}

export default function FilesPage() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [query, setQuery] = useState('');
  const rel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter(
      (f) => !q || t(`file.${f.nameKey}`).toLowerCase().includes(q),
    );
  }, [query, t]);

  const usedKb = files.reduce((a, f) => a + f.sizeKb, 0);
  const quotaKb = 200 * 1024;

  const columns: TableColumnsType<FileNode> = [
    {
      title: t('files.name'),
      dataIndex: 'nameKey',
      render: (k: string, f) => (
        <Space>
          {ICONS[f.kind]}
          {t(`file.${k}`)}
        </Space>
      ),
    },
    {
      title: t('files.owner'),
      dataIndex: 'owner',
      responsive: ['md'],
      render: (o: string) => t(`person.${o}`),
    },
    {
      title: t('files.modified'),
      dataIndex: 'daysAgo',
      responsive: ['lg'],
      render: (d: number) => rel.format(-d, 'day'),
    },
    {
      title: t('files.size'),
      dataIndex: 'sizeKb',
      align: 'right',
      render: (kb: number) => formatSize(kb, i18n.language),
      sorter: (a, b) => a.sizeKb - b.sizeKb,
    },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.files')}
        description={t('page.filesDesc')}
        extra={
          <Space>
            <Segmented
              value={view}
              onChange={(v) => setView(v as 'grid' | 'list')}
              options={[
                {
                  value: 'list',
                  icon: <BarsOutlined />,
                  label: t('list.list'),
                },
                {
                  value: 'grid',
                  icon: <AppstoreOutlined />,
                  label: t('list.grid'),
                },
              ]}
            />
            <Upload showUploadList={false} beforeUpload={() => false}>
              <Button type="primary" icon={<CloudUploadOutlined />}>
                {t('files.upload')}
              </Button>
            </Upload>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={18}>
          <Card
            styles={{
              body: { padding: view === 'list' ? 0 : 'var(--space-5)' },
            }}
            title={
              <Breadcrumb
                items={[{ title: t('files.root') }, { title: t('file.brand') }]}
              />
            }
            extra={
              <Input.Search
                allowClear
                placeholder={t('files.search')}
                style={{ width: 220 }}
                onChange={(e) => setQuery(e.target.value)}
              />
            }
          >
            {visible.length === 0 ? (
              <Empty
                description={t('list.noMatches')}
                style={{ padding: 'var(--space-8) 0' }}
              />
            ) : view === 'list' ? (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={visible}
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                rowSelection={{ type: 'checkbox' }}
              />
            ) : (
              <Row gutter={[12, 12]}>
                {visible.map((f) => (
                  <Col xs={12} sm={8} md={6} key={f.id}>
                    <Card
                      hoverable
                      size="small"
                      styles={{
                        body: {
                          padding: 'var(--space-4)',
                          textAlign: 'center',
                        },
                      }}
                    >
                      <div
                        style={{ fontSize: 30, marginBottom: 'var(--space-2)' }}
                      >
                        {ICONS[f.kind]}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-sm)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t(`file.${f.nameKey}`)}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--c-text-tertiary)',
                        }}
                      >
                        {formatSize(f.sizeKb, i18n.language)}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>

        <Col xs={24} xl={6}>
          <Card title={t('files.storage')}>
            <Progress percent={Math.round((usedKb / quotaKb) * 100)} />
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--c-text-tertiary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {t('files.quota', {
                used: formatSize(usedKb, i18n.language),
                total: formatSize(quotaKb, i18n.language),
              })}
            </div>
            <List
              size="small"
              header={<strong>{t('files.recent')}</strong>}
              dataSource={[...files]
                .sort((a, b) => a.daysAgo - b.daysAgo)
                .slice(0, 4)}
              renderItem={(f) => (
                <List.Item>
                  <Space>
                    {ICONS[f.kind]}
                    {t(`file.${f.nameKey}`)}
                  </Space>
                  <Tag bordered={false}>{rel.format(-f.daysAgo, 'day')}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
