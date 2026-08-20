import { LockOutlined, UndoOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Segmented,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import {
  ACTIONS,
  DEFAULT_GRANTS,
  RESOURCES,
  ROLES,
  permission,
  type Action,
  type Permission,
  type Resource,
  type Role,
} from '@/config/permissions';
import { NAVIGATION, navLeaves } from '@/config/navigation';
import { canAccessRoute, routePermission } from '@/lib/access';
import { useAuth } from '@/stores/auth';

interface MatrixRow {
  resource: Resource;
}

export default function AccessMatrixPage() {
  const { t } = useTranslation();
  const { modal } = App.useApp();
  const { role, setRole, grants, toggleGrant, resetGrants } = useAuth();

  /**
   * Which role is being EDITED — deliberately separate from which role you ARE.
   *
   * Binding the matrix selector straight to the signed-in role meant clicking
   * "Editor" made you an editor, and since editors lack users:view the guard
   * immediately bounced you to /403 — you could not edit any role but your own.
   * Editing is local; changing identity is a separate, explicit act below.
   */
  const [editing, setEditing] = useState<Role>(role);

  const dirty = useMemo(
    () =>
      ROLES.some(
        (r) =>
          grants[r].length !== DEFAULT_GRANTS[r].length ||
          grants[r].some((p) => !DEFAULT_GRANTS[r].includes(p)),
      ),
    [grants],
  );

  /**
   * Editing a permission the current role holds can lock the editor out of this
   * very page, so the checkbox that would do it is disabled rather than allowed
   * to fire and strand them behind a 403.
   */
  const wouldLockOut = (r: Role, p: Permission) =>
    r === role && p === 'users:view' && grants[r].includes(p);

  /** Acting as a role without users:view would strand you outside this page. */
  const previewWouldLockOut = (r: Role) => !grants[r].includes('users:view');

  const actAs = (next: Role) => {
    if (!previewWouldLockOut(next)) {
      setRole(next);
      return;
    }
    modal.confirm({
      title: t('access.actAsTitle', { role: t(`role.${next}`) }),
      icon: <WarningOutlined />,
      content: t('access.actAsDesc'),
      okText: t('access.actAsConfirm'),
      cancelText: t('action.cancel'),
      onOk: () => setRole(next),
    });
  };

  const columns: TableColumnsType<MatrixRow> = [
    {
      title: t('access.resource'),
      dataIndex: 'resource',
      fixed: 'left',
      width: 150,
      render: (r: Resource) => <strong>{t(`resource.${r}`)}</strong>,
    },
    ...ACTIONS.map<TableColumnsType<MatrixRow>[number]>((action: Action) => ({
      title: t(`action.${action}`),
      key: action,
      align: 'center',
      width: 110,
      render: (_v: unknown, row: MatrixRow) => {
        const p = permission(row.resource, action);
        const held = grants[editing].includes(p);
        const locked = wouldLockOut(editing, p);
        const control = (
          <Checkbox
            checked={held}
            disabled={locked}
            aria-label={`${t(`resource.${row.resource}`)} ${t(`action.${action}`)}`}
            onChange={() => toggleGrant(editing, p)}
          />
        );
        return locked ? (
          <Tooltip title={t('access.lockoutHint')}>
            <span>{control}</span>
          </Tooltip>
        ) : (
          control
        );
      },
    })),
  ];

  /** What the current grants actually mean for navigation — the payoff of
   *  keeping route permissions as data rather than scattered checks. */
  const routeImpact = useMemo(() => {
    const leaves = navLeaves(NAVIGATION).filter((n) => routePermission(n.key));
    return leaves.map((n) => ({
      key: n.key,
      label: n.labelKey,
      required: routePermission(n.key)!,
      allowed: canAccessRoute(grants, editing, n.key),
    }));
  }, [grants, editing]);

  const blocked = routeImpact.filter((r) => !r.allowed);

  return (
    <>
      <PageHeader
        title={t('nav.access')}
        description={t('page.accessDesc')}
        extra={
          <Button
            icon={<UndoOutlined />}
            disabled={!dirty}
            onClick={() => {
              modal.confirm({
                title: t('access.resetTitle'),
                icon: <WarningOutlined />,
                content: t('access.resetDesc'),
                okText: t('action.reset'),
                cancelText: t('action.cancel'),
                onOk: resetGrants,
              });
            }}
          >
            {t('access.resetDefaults')}
          </Button>
        }
      />

      <Alert
        type="info"
        showIcon
        icon={<LockOutlined />}
        message={t('access.liveNotice')}
        description={t('access.liveNoticeDesc')}
        style={{ marginBottom: 'var(--space-4)' }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title={t('access.matrix')}
            styles={{ body: { padding: 0 } }}
            extra={
              <Segmented
                value={editing}
                onChange={(v) => setEditing(v)}
                options={ROLES.map((r) => ({
                  value: r,
                  label: t(`role.${r}`),
                }))}
              />
            }
          >
            <Table<MatrixRow>
              rowKey="resource"
              size="small"
              pagination={false}
              scroll={{ x: 'max-content' }}
              columns={columns}
              dataSource={RESOURCES.map((resource) => ({ resource }))}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            title={t('access.effect')}
            styles={{ body: { padding: 'var(--space-5)' } }}
          >
            <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
              {t('access.effectDesc', {
                role: t(`role.${editing}`),
                blocked: blocked.length,
                total: routeImpact.length,
              })}
            </Typography.Paragraph>

            <Button
              block
              disabled={editing === role}
              onClick={() => actAs(editing)}
              style={{ marginBottom: 'var(--space-4)' }}
            >
              {editing === role
                ? t('access.actingAs', { role: t(`role.${role}`) })
                : t('access.actAs', { role: t(`role.${editing}`) })}
            </Button>

            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {routeImpact.map((r) => (
                <div
                  key={r.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                    opacity: r.allowed ? 1 : 0.55,
                  }}
                >
                  <span style={{ minWidth: 0 }}>{t(r.label)}</span>
                  <Tag
                    color={r.allowed ? 'success' : 'default'}
                    style={{ marginInlineEnd: 0 }}
                  >
                    {r.allowed ? t('access.allowed') : t('access.blocked')}
                  </Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}
