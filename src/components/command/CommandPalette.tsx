import {
  ArrowRightOutlined,
  BgColorsOutlined,
  ColumnHeightOutlined,
  GlobalOutlined,
  MoonOutlined,
  SearchOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Empty, Input, Modal, Tag } from 'antd';
import type { InputRef } from 'antd';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { navLeaves } from '@/config/navigation';
import { THEME_PRESETS, type ColorMode, type Density } from '@/config/theme';
import { SUPPORTED_LOCALES, changeLocale } from '@/i18n';
import { rankByFuzzy } from '@/lib/fuzzy';
import { usePreferences } from '@/stores/preferences';

interface Command {
  id: string;
  label: string;
  group: string;
  icon: ReactNode;
  hint?: string;
  haystack: string;
  run: () => void;
}

const MODE_ICON: Record<ColorMode, ReactNode> = {
  light: <SunOutlined />,
  dark: <MoonOutlined />,
  system: <ColumnHeightOutlined />,
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const prefs = usePreferences();
  const inputRef = useRef<InputRef>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  /**
   * Navigation commands come from the shared NAVIGATION tree, so a page added
   * to the sidebar is searchable here without a second registration.
   */
  const commands = useMemo<Command[]>(() => {
    const go: Command[] = navLeaves().map((n) => ({
      id: `go:${n.key}`,
      label: t(n.labelKey),
      group: t('palette.group.navigate'),
      icon: <ArrowRightOutlined />,
      hint: n.key,
      haystack: `${t(n.labelKey)} ${n.key}`,
      run: () => void navigate(n.key),
    }));

    const themes: Command[] = THEME_PRESETS.map((p) => ({
      id: `theme:${p.id}`,
      label: t('palette.setTheme', { name: t(p.labelKey) }),
      group: t('palette.group.theme'),
      icon: <BgColorsOutlined />,
      haystack: `${t(p.labelKey)} ${t('palette.setTheme', { name: t(p.labelKey) })}`,
      run: () => prefs.setPresetId(p.id),
    }));

    const modes: Command[] = (['light', 'dark', 'system'] as ColorMode[]).map(
      (m) => ({
        id: `mode:${m}`,
        label: t('palette.setMode', { name: t(`theme.mode.${m}`) }),
        group: t('palette.group.theme'),
        icon: MODE_ICON[m],
        haystack: `${t(`theme.mode.${m}`)} ${t('palette.setMode', { name: t(`theme.mode.${m}`) })}`,
        run: () => prefs.setColorMode(m),
      }),
    );

    const densities: Command[] = (
      ['comfortable', 'compact', 'condensed'] as Density[]
    ).map((d) => ({
      id: `density:${d}`,
      label: t('palette.setDensity', { name: t(`theme.density.${d}`) }),
      group: t('palette.group.theme'),
      icon: <ColumnHeightOutlined />,
      haystack: `${t(`theme.density.${d}`)} ${t('palette.setDensity', { name: t(`theme.density.${d}`) })}`,
      run: () => prefs.setDensity(d),
    }));

    const locales: Command[] = SUPPORTED_LOCALES.filter(
      (c) => c !== i18n.language,
    ).map((c) => ({
      id: `locale:${c}`,
      label: t('palette.setLocale', { name: t(`locale.${c}`) }),
      group: t('palette.group.locale'),
      icon: <GlobalOutlined />,
      haystack: `${t(`locale.${c}`)} ${c}`,
      run: () => void changeLocale(c),
    }));

    return [...go, ...themes, ...modes, ...densities, ...locales];
  }, [t, i18n.language, navigate, prefs]);

  /**
   * Ranked by score, then bucketed so each group is contiguous, with groups
   * ordered by their best match. Ranking alone interleaves them, which renders
   * the same heading two or three times down the list.
   */
  const results = useMemo(() => {
    const ranked = rankByFuzzy(query, commands);
    const buckets = new Map<string, typeof ranked>();
    for (const cmd of ranked) {
      const bucket = buckets.get(cmd.group);
      if (bucket) bucket.push(cmd);
      else buckets.set(cmd.group, [cmd]);
    }
    return [...buckets.values()].flat().slice(0, 40);
  }, [query, commands]);

  // Reset when reopened, so the palette never resumes a stale search.
  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${cursor}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const runAt = (index: number) => {
    const cmd = results[index];
    if (!cmd) return;
    cmd.run();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      destroyOnHidden
      width={560}
      styles={{ body: { padding: 0 } }}
      // The input owns focus; antd would otherwise focus the dialog itself.
      afterOpenChange={(o) => o && inputRef.current?.focus()}
    >
      <Input
        ref={inputRef}
        size="large"
        variant="borderless"
        prefix={<SearchOutlined style={{ color: 'var(--c-text-tertiary)' }} />}
        placeholder={t('palette.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // Combobox semantics so a screen reader announces the active option
        // rather than silently moving focus around.
        role="combobox"
        aria-expanded
        aria-controls="command-palette-list"
        aria-activedescendant={
          results[cursor] ? `command-${results[cursor].id}` : undefined
        }
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCursor((c) => (results.length ? (c + 1) % results.length : 0));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursor((c) =>
              results.length ? (c - 1 + results.length) % results.length : 0,
            );
          } else if (e.key === 'Enter') {
            e.preventDefault();
            runAt(cursor);
          }
        }}
        style={{
          borderBottom: '1px solid var(--c-border)',
          borderRadius: 0,
          paddingBlock: 'var(--space-4)',
        }}
      />

      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {results.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('palette.noResults')}
            style={{ padding: 'var(--space-8) 0' }}
          />
        ) : (
          <ul
            id="command-palette-list"
            ref={listRef}
            role="listbox"
            aria-label={t('palette.results')}
            style={{ listStyle: 'none', margin: 0, padding: 'var(--space-2)' }}
          >
            {results.map((cmd, i) => {
              const showGroup = i === 0 || results[i - 1]!.group !== cmd.group;
              return (
                <li key={cmd.id}>
                  {showGroup && (
                    <div
                      style={{
                        padding: 'var(--space-3) var(--space-3) var(--space-1)',
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--c-text-tertiary)',
                      }}
                    >
                      {cmd.group}
                    </div>
                  )}
                  <div
                    id={`command-${cmd.id}`}
                    role="option"
                    aria-selected={i === cursor}
                    data-index={i}
                    onMouseMove={() => setCursor(i)}
                    onClick={() => runAt(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background:
                        i === cursor
                          ? 'var(--c-surface-sunken)'
                          : 'transparent',
                    }}
                  >
                    <span style={{ color: 'var(--c-text-tertiary)' }}>
                      {cmd.icon}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>{cmd.label}</span>
                    {cmd.hint && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--c-text-tertiary)',
                        }}
                      >
                        {cmd.hint}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          borderTop: '1px solid var(--c-border)',
          fontSize: 'var(--text-xs)',
          color: 'var(--c-text-tertiary)',
        }}
      >
        <span>
          <Tag style={{ marginInlineEnd: 4 }}>↑↓</Tag>
          {t('palette.hintNavigate')}
        </span>
        <span>
          <Tag style={{ marginInlineEnd: 4 }}>↵</Tag>
          {t('palette.hintRun')}
        </span>
        <span>
          <Tag style={{ marginInlineEnd: 4 }}>esc</Tag>
          {t('action.close')}
        </span>
      </div>
    </Modal>
  );
}
