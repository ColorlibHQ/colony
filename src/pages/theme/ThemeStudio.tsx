import {
  CheckOutlined,
  CopyOutlined,
  DownloadOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  ColorPicker,
  Divider,
  Input,
  Progress,
  Radio,
  Row,
  Segmented,
  Slider,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { THEME_PRESETS, type ThemePresetId } from '@/config/theme';
import { contrastRatio, wcagLevel } from '@/lib/contrast';
import { usePreferences } from '@/stores/preferences';

/**
 * Theme Studio.
 *
 * Ant Design v6 enables CSS variables by default, which is what makes editing
 * tokens live actually practical — v5's CSS-in-JS meant recomputing a style
 * sheet on every keystroke.
 *
 * The editor drives the app's real preference store, so what you see in the
 * preview is what the whole app is already using; there is no separate
 * "preview theme" that can drift from the real one.
 */
export default function ThemeStudioPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const {
    presetId,
    setPresetId,
    colorMode,
    setColorMode,
    customPrimary,
    setCustomPrimary,
    customRadius,
    setCustomRadius,
    resetCustom,
  } = usePreferences();

  const preset =
    THEME_PRESETS.find((p) => p.id === presetId) ?? THEME_PRESETS[0]!;

  /**
   * The editor writes straight to the app's preference store rather than to
   * local state. There is no separate "preview theme" that could drift from the
   * real one — the sidebar, header and every other open surface update with the
   * preview, which is the whole point of editing tokens live.
   */
  const primary =
    customPrimary ??
    (colorMode === 'dark' ? preset.colorPrimaryDark : preset.colorPrimary);
  const radius = customRadius ?? preset.borderRadius;
  const dirty = customPrimary !== null || customRadius !== null;

  const applyPreset = (id: ThemePresetId) => setPresetId(id);

  /**
   * Contrast of the accent against the surface it sits on. Shown because a
   * colour picker with no contrast readout is how inaccessible themes get
   * shipped — the value looks fine to whoever picked it.
   */
  const contrast = useMemo(() => {
    const surface = colorMode === 'dark' ? '#1b1e25' : '#ffffff';
    const ratio = contrastRatio(primary, surface);
    return { ratio, level: wcagLevel(ratio) };
  }, [primary, colorMode]);

  const themeFile = useMemo(
    () =>
      `import type { ThemeConfig } from 'antd';\n\n` +
      `export const theme: ThemeConfig = {\n` +
      `  token: {\n` +
      `    colorPrimary: '${primary}',\n` +
      `    borderRadius: ${radius},\n` +
      `  },\n` +
      `};\n`,
    [primary, radius],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(themeFile);
    void message.success(t('studio.copied'));
  };

  const download = () => {
    const blob = new Blob([themeFile], {
      type: 'text/typescript;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.ts';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title={t('nav.themeStudio')}
        description={t('page.themeStudioDesc')}
        extra={
          <Space>
            <Button
              icon={<UndoOutlined />}
              disabled={!dirty}
              onClick={resetCustom}
            >
              {t('action.reset')}
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => void copy()}>
              {t('studio.copy')}
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={download}
            >
              {t('studio.export')}
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {/* ---- Controls ---- */}
        <Col xs={24} xl={9}>
          <Card
            title={t('studio.tokens')}
            style={{ marginBottom: 'var(--space-4)' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div>
                <div
                  style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}
                >
                  {t('theme.preset.label')}
                </div>
                <Space wrap size={8}>
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={p.id === presetId}
                      aria-label={t(p.labelKey)}
                      onClick={() => applyPreset(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: 'transparent',
                        color: 'inherit',
                        font: 'inherit',
                        border:
                          p.id === presetId
                            ? '1px solid var(--ant-color-primary)'
                            : '1px solid var(--c-border)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: p.colorPrimary,
                          boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 12%)',
                        }}
                      />
                      {t(p.labelKey)}
                      {p.id === presetId && (
                        <CheckOutlined style={{ fontSize: 11 }} />
                      )}
                    </button>
                  ))}
                </Space>
              </div>

              <Divider style={{ margin: 0 }} />

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{t('studio.primary')}</span>
                  <ColorPicker
                    value={primary}
                    showText
                    onChange={(c) => setCustomPrimary(c.toHexString())}
                  />
                </div>
                <Alert
                  type={contrast.level === 'fail' ? 'warning' : 'success'}
                  showIcon
                  message={
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {t('studio.contrast', {
                        ratio: contrast.ratio.toFixed(2),
                      })}{' '}
                      · {t(`studio.wcag.${contrast.level}`)}
                    </span>
                  }
                  description={
                    contrast.level === 'fail'
                      ? t('studio.contrastHint')
                      : undefined
                  }
                />
              </div>

              <div>
                <div
                  style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}
                >
                  {t('studio.radius')} — {radius}px
                </div>
                <Slider
                  min={0}
                  max={16}
                  value={radius}
                  onChange={setCustomRadius}
                />
              </div>

              <Divider style={{ margin: 0 }} />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 500 }}>{t('theme.label')}</span>
                <Segmented
                  value={colorMode}
                  onChange={(v) =>
                    setColorMode(v as 'light' | 'dark' | 'system')
                  }
                  options={[
                    { value: 'light', label: t('theme.mode.light') },
                    { value: 'dark', label: t('theme.mode.dark') },
                    { value: 'system', label: t('theme.mode.system') },
                  ]}
                />
              </div>
            </Space>
          </Card>

          <Card title={t('studio.output')} styles={{ body: { padding: 0 } }}>
            <Input.TextArea
              readOnly
              value={themeFile}
              autoSize={{ minRows: 8 }}
              style={{
                border: 0,
                borderRadius: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                resize: 'none',
              }}
            />
          </Card>
        </Col>

        {/* ---- Live preview ---- */}
        <Col xs={24} xl={15}>
          <Card title={t('studio.preview')}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Space wrap>
                <Button type="primary">{t('action.submit')}</Button>
                <Button>{t('action.cancel')}</Button>
                <Button type="dashed">{t('action.create')}</Button>
                <Button danger>{t('action.delete')}</Button>
                <Button type="primary" disabled>
                  {t('elements.disabled')}
                </Button>
              </Space>

              <Space wrap>
                <Tag color="success">{t('serviceStatus.healthy')}</Tag>
                <Tag color="warning">{t('serviceStatus.degraded')}</Tag>
                <Tag color="error">{t('serviceStatus.down')}</Tag>
                <Tag color="processing">{t('elements.inProgress')}</Tag>
                <Switch defaultChecked />
                <Radio.Group
                  defaultValue="a"
                  optionType="button"
                  options={[
                    { value: 'a', label: t('elements.large') },
                    { value: 'b', label: t('elements.medium') },
                  ]}
                />
              </Space>

              <Progress percent={64} />

              <Tabs
                items={[
                  { key: '1', label: t('cards.tabOverview'), children: null },
                  { key: '2', label: t('cards.tabActivity'), children: null },
                ]}
                style={{ marginBottom: -16 }}
              />

              <Table
                size="small"
                pagination={false}
                rowKey="k"
                columns={[
                  { title: t('table.product'), dataIndex: 'n' },
                  {
                    title: t('table.status'),
                    dataIndex: 's',
                    render: (s: string) => <Tag color="success">{s}</Tag>,
                  },
                  { title: t('table.amount'), dataIndex: 'a', align: 'right' },
                ]}
                dataSource={[
                  {
                    k: '1',
                    n: 'Aurora Sensor Kit',
                    s: t('status.active'),
                    a: '$249',
                  },
                  {
                    k: '2',
                    n: 'Lattice Edge Node',
                    s: t('status.active'),
                    a: '$419',
                  },
                ]}
              />

              <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                {t('studio.previewNote')}
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}
