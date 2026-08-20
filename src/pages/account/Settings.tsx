import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Select,
  Space,
  Switch,
  Tabs,
  Upload,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { SUPPORTED_LOCALES, changeLocale, isSupportedLocale } from '@/i18n';
import { THEME_PRESETS, type ColorMode, type Density } from '@/config/theme';
import { usePreferences } from '@/stores/preferences';

function Row({
  label,
  hint,
  control,
}: {
  label: string;
  hint?: string;
  control: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
        paddingBlock: 'var(--space-4)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500 }}>{label}</div>
        {hint && (
          <div
            style={{
              color: 'var(--c-text-tertiary)',
              fontSize: 'var(--text-xs)',
              maxWidth: '52ch',
            }}
          >
            {hint}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

export default function AccountSettingsPage() {
  const { t, i18n } = useTranslation();
  const {
    colorMode,
    setColorMode,
    presetId,
    setPresetId,
    density,
    setDensity,
  } = usePreferences();

  return (
    <>
      <PageHeader
        title={t('nav.settings')}
        description={t('page.settingsDesc')}
      />

      <Card>
        <Tabs
          items={[
            {
              key: 'profile',
              label: t('settings.profile'),
              children: (
                <Space
                  direction="vertical"
                  size={0}
                  style={{ width: '100%', maxWidth: 640 }}
                >
                  <Row
                    label={t('settings.avatar')}
                    hint={t('settings.avatarHint')}
                    control={
                      <Space>
                        <Avatar
                          size={48}
                          style={{ background: 'var(--ant-color-primary)' }}
                        >
                          A
                        </Avatar>
                        <Upload
                          showUploadList={false}
                          beforeUpload={() => false}
                        >
                          <Button>{t('settings.change')}</Button>
                        </Upload>
                      </Space>
                    }
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('form.name')}
                    control={
                      <Input
                        defaultValue="Aigars Silkalns"
                        style={{ width: 260 }}
                      />
                    }
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('form.email')}
                    control={
                      <Input
                        defaultValue="aigars@colorlib.com"
                        style={{ width: 260 }}
                      />
                    }
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('settings.bio')}
                    control={
                      <Input.TextArea
                        rows={3}
                        style={{ width: 260 }}
                        defaultValue={t('cards.profileRole')}
                      />
                    }
                  />
                  <div style={{ marginTop: 'var(--space-5)' }}>
                    <Button type="primary">{t('action.save')}</Button>
                  </div>
                </Space>
              ),
            },
            {
              key: 'appearance',
              label: t('settings.appearance'),
              children: (
                <Space
                  direction="vertical"
                  size={0}
                  style={{ width: '100%', maxWidth: 640 }}
                >
                  <Row
                    label={t('theme.label')}
                    hint={t('settings.themeHint')}
                    control={
                      <Select
                        value={colorMode}
                        style={{ width: 180 }}
                        onChange={(v) => setColorMode(v)}
                        options={(
                          ['light', 'dark', 'system'] as ColorMode[]
                        ).map((m) => ({
                          value: m,
                          label: t(`theme.mode.${m}`),
                        }))}
                      />
                    }
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('theme.preset.label')}
                    control={
                      <Select
                        value={presetId}
                        style={{ width: 180 }}
                        onChange={(v) => setPresetId(v)}
                        options={THEME_PRESETS.map((p) => ({
                          value: p.id,
                          label: t(p.labelKey),
                        }))}
                      />
                    }
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('theme.density.label')}
                    hint={t('settings.densityHint')}
                    control={
                      <Select
                        value={density}
                        style={{ width: 180 }}
                        onChange={(v) => setDensity(v)}
                        options={(
                          ['comfortable', 'compact', 'condensed'] as Density[]
                        ).map((d) => ({
                          value: d,
                          label: t(`theme.density.${d}`),
                        }))}
                      />
                    }
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('locale.label')}
                    control={
                      <Select
                        value={i18n.language}
                        style={{ width: 180 }}
                        onChange={(v) => {
                          if (isSupportedLocale(v)) void changeLocale(v);
                        }}
                        options={SUPPORTED_LOCALES.map((c) => ({
                          value: c,
                          label: t(`locale.${c}`),
                        }))}
                      />
                    }
                  />
                </Space>
              ),
            },
            {
              key: 'notifications',
              label: t('settings.notifications'),
              children: (
                <Space
                  direction="vertical"
                  size={0}
                  style={{ width: '100%', maxWidth: 640 }}
                >
                  {(['deploys', 'mentions', 'digest', 'security'] as const).map(
                    (k, i, arr) => (
                      <div key={k}>
                        <Row
                          label={t(`settings.notif.${k}`)}
                          hint={t(`settings.notifHint.${k}`)}
                          control={<Switch defaultChecked={k !== 'digest'} />}
                        />
                        {i < arr.length - 1 && (
                          <Divider style={{ margin: 0 }} />
                        )}
                      </div>
                    ),
                  )}
                </Space>
              ),
            },
            {
              key: 'security',
              label: t('settings.security'),
              children: (
                <Space
                  direction="vertical"
                  size={0}
                  style={{ width: '100%', maxWidth: 640 }}
                >
                  <Row
                    label={t('settings.password')}
                    hint={t('settings.passwordHint')}
                    control={<Button>{t('settings.change')}</Button>}
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('settings.twoFactor')}
                    hint={t('settings.twoFactorHint')}
                    control={<Switch />}
                  />
                  <Divider style={{ margin: 0 }} />
                  <Row
                    label={t('settings.sessions')}
                    hint={t('settings.sessionsHint')}
                    control={<Button danger>{t('settings.revokeAll')}</Button>}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
