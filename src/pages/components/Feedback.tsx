import { InboxOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Modal,
  Popconfirm,
  Result,
  Row,
  Skeleton,
  Space,
  Spin,
  Steps,
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import {
  ShowcaseSection,
  ShowcaseStack,
} from '@/components/common/ShowcaseSection';

export default function FeedbackPage() {
  const { t } = useTranslation();
  // App.useApp() rather than the static message/notification exports — the
  // static ones render outside ConfigProvider and silently lose the theme.
  const { message, notification, modal } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageHeader
        title={t('nav.feedback')}
        description={t('page.feedbackDesc')}
      />

      <ShowcaseStack
        title={t('feedback.alerts')}
        description={t('feedback.alertsDesc')}
      >
        <Alert type="info" message={t('feedback.infoMsg')} showIcon />
        <Alert type="success" message={t('feedback.successMsg')} showIcon />
        <Alert
          type="warning"
          message={t('feedback.warningMsg')}
          description={t('feedback.warningDesc')}
          showIcon
          closable
        />
        <Alert
          type="error"
          message={t('feedback.errorMsg')}
          description={t('feedback.errorDesc')}
          showIcon
          action={
            <Button size="small" danger>
              {t('state.retry')}
            </Button>
          }
        />
      </ShowcaseStack>

      <ShowcaseSection
        title={t('feedback.transient')}
        description={t('feedback.transientDesc')}
      >
        <Button onClick={() => void message.success(t('state.saved'))}>
          {t('feedback.showMessage')}
        </Button>
        <Button
          onClick={() => {
            notification.info({
              message: t('feedback.notifTitle'),
              description: t('feedback.notifDesc'),
              placement: 'bottomRight',
            });
          }}
        >
          {t('feedback.showNotification')}
        </Button>
        <Button onClick={() => setModalOpen(true)}>
          {t('feedback.showModal')}
        </Button>
        <Button onClick={() => setDrawerOpen(true)}>
          {t('feedback.showDrawer')}
        </Button>
        <Button
          danger
          onClick={() => {
            modal.confirm({
              title: t('feedback.confirmTitle'),
              icon: <WarningOutlined />,
              content: t('feedback.confirmDesc'),
              okText: t('action.delete'),
              okButtonProps: { danger: true },
              cancelText: t('action.cancel'),
            });
          }}
        >
          {t('feedback.showConfirm')}
        </Button>
        <Popconfirm
          title={t('feedback.confirmTitle')}
          description={t('feedback.confirmDesc')}
          okText={t('action.confirm')}
          cancelText={t('action.cancel')}
        >
          <Button>{t('feedback.showPopconfirm')}</Button>
        </Popconfirm>
      </ShowcaseSection>

      <ShowcaseStack
        title={t('feedback.progressSteps')}
        description={t('feedback.progressStepsDesc')}
      >
        <Steps
          current={1}
          items={[
            { title: t('steps.details'), description: t('steps.detailsDesc') },
            { title: t('steps.review'), description: t('steps.reviewDesc') },
            { title: t('steps.done'), description: t('steps.doneDesc') },
          ]}
        />
        <Steps
          current={2}
          status="error"
          size="small"
          items={[
            { title: t('steps.details') },
            { title: t('steps.review') },
            { title: t('steps.done') },
          ]}
        />
      </ShowcaseStack>

      <Row gutter={[16, 16]} style={{ marginBottom: 'var(--space-4)' }}>
        <Col xs={24} md={12}>
          <Card title={t('feedback.loadingStates')}>
            <Skeleton active paragraph={{ rows: 3 }} />
            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <Spin />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('feedback.emptyStates')}>
            <Empty
              image={
                <InboxOutlined
                  style={{ fontSize: 48, color: 'var(--c-text-tertiary)' }}
                />
              }
              description={t('state.empty')}
            >
              <Button type="primary">{t('action.create')}</Button>
            </Empty>
          </Card>
        </Col>
      </Row>

      <Card title={t('feedback.results')}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Result
              status="success"
              title={t('feedback.resultSuccess')}
              subTitle={t('feedback.resultSuccessDesc')}
              extra={<Button type="primary">{t('action.back')}</Button>}
            />
          </Col>
          <Col xs={24} md={12}>
            <Result
              status="warning"
              title={t('feedback.resultWarning')}
              subTitle={t('feedback.resultWarningDesc')}
              extra={<Button>{t('state.retry')}</Button>}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        title={t('feedback.modalTitle')}
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        okText={t('action.confirm')}
        cancelText={t('action.cancel')}
      >
        <p>{t('feedback.modalBody')}</p>
      </Modal>

      <Drawer
        title={t('feedback.drawerTitle')}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>
              {t('action.cancel')}
            </Button>
            <Button type="primary" onClick={() => setDrawerOpen(false)}>
              {t('action.save')}
            </Button>
          </Space>
        }
      >
        <p>{t('feedback.drawerBody')}</p>
      </Drawer>
    </>
  );
}
