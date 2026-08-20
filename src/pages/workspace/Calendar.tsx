import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  List,
  Segmented,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import { events, type CalendarEvent } from '@/mocks/workspace';

const KIND_COLOR = {
  meeting: 'var(--ant-color-primary)',
  release: 'var(--c-success)',
  review: 'var(--c-warning)',
  focus: 'var(--c-text-tertiary)',
} as const;

/** The demo month, fixed so the grid never shifts between screenshots. */
const YEAR = 2026;
const MONTH = 7; // August, zero-based

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'month' | 'agenda'>('month');

  const monthName = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        month: 'long',
        year: 'numeric',
      }).format(new Date(YEAR, MONTH, 1)),
    [i18n.language],
  );

  /** Weekday order follows the locale — Sunday-first in en-US, Monday in zh-CN. */
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
    const firstDay = i18n.language === 'zh-CN' ? 1 : 0;
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2026, 1, 1 + ((i + firstDay) % 7))),
    );
  }, [i18n.language]);

  const grid = useMemo(() => {
    const first = new Date(YEAR, MONTH, 1);
    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
    const firstDay = i18n.language === 'zh-CN' ? 1 : 0;
    const lead = (first.getDay() - firstDay + 7) % 7;
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [i18n.language]);

  const byDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.day);
      if (list) list.push(e);
      else map.set(e.day, [e]);
    }
    return map;
  }, []);

  const timeFmt = new Intl.DateTimeFormat(i18n.language, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const dateFmt = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <>
      <PageHeader
        title={t('nav.calendar')}
        description={t('page.calendarDesc')}
        extra={
          <Space>
            <Segmented
              value={view}
              onChange={(v) => setView(v as 'month' | 'agenda')}
              options={[
                { value: 'month', label: t('calendar.month') },
                { value: 'agenda', label: t('calendar.agenda') },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              {t('calendar.newEvent')}
            </Button>
          </Space>
        }
      />

      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<LeftOutlined />}
              aria-label={t('calendar.prev')}
            />
            <span
              style={{
                minWidth: 150,
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {monthName}
            </span>
            <Button
              type="text"
              icon={<RightOutlined />}
              aria-label={t('calendar.next')}
            />
          </Space>
        }
        styles={{ body: { padding: view === 'month' ? 'var(--space-4)' : 0 } }}
      >
        {view === 'month' ? (
          <div role="grid" aria-label={monthName}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {weekdays.map((w) => (
                <div
                  key={w}
                  style={{
                    textAlign: 'center',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--c-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {w}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'var(--space-2)',
              }}
            >
              {grid.map((day, i) => (
                <div
                  key={day ?? `pad-${i}`}
                  role="gridcell"
                  style={{
                    minHeight: 92,
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--c-border-soft)',
                    background: day ? 'var(--c-surface)' : 'transparent',
                    borderColor: day ? 'var(--c-border-soft)' : 'transparent',
                  }}
                >
                  {day && (
                    <>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--c-text-tertiary)',
                          fontVariantNumeric: 'tabular-nums',
                          marginBottom: 4,
                        }}
                      >
                        {day}
                      </div>
                      <Space
                        direction="vertical"
                        size={2}
                        style={{ width: '100%' }}
                      >
                        {(byDay.get(day) ?? []).map((e) => (
                          <div
                            key={e.id}
                            title={t(`event.${e.titleKey}`)}
                            style={{
                              fontSize: 11,
                              padding: '2px 5px',
                              borderRadius: 4,
                              borderInlineStart: `3px solid ${KIND_COLOR[e.kind]}`,
                              background: 'var(--c-surface-sunken)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t(`event.${e.titleKey}`)}
                          </div>
                        ))}
                      </Space>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <List
            dataSource={[...events].sort(
              (a, b) => a.day - b.day || a.hour - b.hour,
            )}
            renderItem={(e) => (
              <List.Item style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <List.Item.Meta
                  avatar={<Badge color={KIND_COLOR[e.kind]} />}
                  title={t(`event.${e.titleKey}`)}
                  description={
                    <Space size={8}>
                      <span>
                        {dateFmt.format(new Date(YEAR, MONTH, e.day))}
                      </span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {timeFmt.format(new Date(YEAR, MONTH, e.day, e.hour))}
                      </span>
                      <Tag bordered={false}>{t(`eventKind.${e.kind}`)}</Tag>
                    </Space>
                  }
                />
                <Typography.Text type="secondary">
                  {t('calendar.hours', { count: e.durationH })}
                </Typography.Text>
              </List.Item>
            )}
          />
        )}
      </Card>
    </>
  );
}
