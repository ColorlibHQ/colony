import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Badge, Card, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';
import {
  TASK_STATUSES,
  tasks as seedTasks,
  type Task,
  type TaskStatus,
} from '@/mocks/workspace';

const PRIORITY_COLOR = {
  high: 'error',
  medium: 'warning',
  low: 'default',
} as const;

function TaskCard({ task, dragging }: { task: Task; dragging?: boolean }) {
  const { t } = useTranslation();
  return (
    <Card
      size="small"
      styles={{ body: { padding: 'var(--space-3)' } }}
      style={{
        marginBottom: 'var(--space-2)',
        cursor: 'grab',
        opacity: dragging ? 0.4 : 1,
        boxShadow: dragging ? 'none' : 'var(--shadow-sm)',
      }}
    >
      <Typography.Text
        style={{ display: 'block', marginBottom: 'var(--space-2)' }}
      >
        {t(`task.${task.titleKey}`)}
      </Typography.Text>
      <Space
        size={6}
        wrap
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Space size={4} wrap>
          <Tag color={PRIORITY_COLOR[task.priority]} bordered={false}>
            {t(`priority.${task.priority}`)}
          </Tag>
          {task.tags.map((tag) => (
            <Tag key={tag} bordered={false}>
              {t(`tag.${tag}`)}
            </Tag>
          ))}
        </Space>
        <Space size={6}>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--c-text-tertiary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {task.points}
          </span>
          <Avatar
            size={22}
            style={{ background: 'var(--ant-color-primary)', fontSize: 11 }}
          >
            {t(`person.${task.assignee}`).charAt(0)}
          </Avatar>
        </Space>
      </Space>
    </Card>
  );
}

function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} dragging={isDragging} />
    </div>
  );
}

function Column({ status, items }: { status: TaskStatus; items: Task[] }) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const points = items.reduce((a, x) => a + x.points, 0);

  return (
    <div style={{ flex: '1 1 240px', minWidth: 240 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)',
          paddingInline: 'var(--space-1)',
        }}
      >
        <Space size={8}>
          <strong>{t(`taskStatus.${status}`)}</strong>
          <Badge
            count={items.length}
            showZero
            color="var(--c-text-tertiary)"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          />
        </Space>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--c-text-tertiary)',
          }}
        >
          {t('kanban.points', { count: points })}
        </span>
      </div>

      <div
        ref={setNodeRef}
        data-column={status}
        style={{
          minHeight: 160,
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-lg)',
          background: isOver ? 'var(--c-info-bg)' : 'var(--c-surface-sunken)',
          // A drop target that never acknowledges the pointer feels broken even
          // when the drop works.
          outline: isOver
            ? '2px dashed var(--c-info)'
            : '2px dashed transparent',
          transition:
            'background var(--dur-fast), outline-color var(--dur-fast)',
        }}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Task[]>(seedTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  /**
   * dnd-kit rather than the HTML5 drag API: it gives keyboard dragging and
   * touch support, which the native API does not. It is loaded with this route
   * only, so it never reaches the entry bundle.
   */
  const sensors = useSensors(
    // A small distance threshold keeps a plain click from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const byStatus = useMemo(
    () =>
      Object.fromEntries(
        TASK_STATUSES.map((s) => [s, items.filter((i) => i.status === s)]),
      ) as Record<TaskStatus, Task[]>,
    [items],
  );

  const active = items.find((i) => i.id === activeId) ?? null;

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active: a, over } = e;
    if (!over) return;

    // `over` is either a column (dropped on empty space) or another task
    // (dropped between cards) — resolve both to a target column.
    const overId = String(over.id);
    const target = (TASK_STATUSES as string[]).includes(overId)
      ? (overId as TaskStatus)
      : items.find((i) => i.id === overId)?.status;
    if (!target) return;

    setItems((prev) =>
      prev.map((i) => (i.id === String(a.id) ? { ...i, status: target } : i)),
    );
  };

  return (
    <>
      <PageHeader title={t('nav.kanban')} description={t('page.kanbanDesc')} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto' }}
        >
          {TASK_STATUSES.map((status) => (
            <Column key={status} status={status} items={byStatus[status]} />
          ))}
        </div>

        {/* Rendered under the cursor so the card does not vanish mid-drag. */}
        <DragOverlay>{active ? <TaskCard task={active} /> : null}</DragOverlay>
      </DndContext>
    </>
  );
}
