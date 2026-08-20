/**
 * Fixtures for the workspace pages. Seeded and static — screenshots and visual
 * regression both depend on these numbers not moving between runs.
 */

export type TaskStatus = 'backlog' | 'progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  titleKey: string;
  status: TaskStatus;
  priority: Priority;
  assignee: 'wei' | 'marta' | 'jonas' | 'li' | 'ana';
  points: number;
  tags: string[];
}

export const TASK_STATUSES: TaskStatus[] = [
  'backlog',
  'progress',
  'review',
  'done',
];

export const tasks: Task[] = [
  {
    id: 't1',
    titleKey: 'virtualise',
    status: 'progress',
    priority: 'high',
    assignee: 'marta',
    points: 8,
    tags: ['react'],
  },
  {
    id: 't2',
    titleKey: 'cjkAudit',
    status: 'review',
    priority: 'high',
    assignee: 'wei',
    points: 5,
    tags: ['typography', 'i18n'],
  },
  {
    id: 't3',
    titleKey: 'themeExport',
    status: 'done',
    priority: 'medium',
    assignee: 'li',
    points: 3,
    tags: ['design'],
  },
  {
    id: 't4',
    titleKey: 'rbacMatrix',
    status: 'done',
    priority: 'high',
    assignee: 'jonas',
    points: 13,
    tags: ['react'],
  },
  {
    id: 't5',
    titleKey: 'bundleBudget',
    status: 'done',
    priority: 'medium',
    assignee: 'jonas',
    points: 2,
    tags: ['performance'],
  },
  {
    id: 't6',
    titleKey: 'kanbanBoard',
    status: 'progress',
    priority: 'medium',
    assignee: 'ana',
    points: 5,
    tags: ['react'],
  },
  {
    id: 't7',
    titleKey: 'docsSite',
    status: 'backlog',
    priority: 'high',
    assignee: 'wei',
    points: 8,
    tags: ['i18n'],
  },
  {
    id: 't8',
    titleKey: 'giteeMirror',
    status: 'backlog',
    priority: 'low',
    assignee: 'li',
    points: 1,
    tags: [],
  },
  {
    id: 't9',
    titleKey: 'a11ySweep',
    status: 'backlog',
    priority: 'medium',
    assignee: 'marta',
    points: 5,
    tags: ['design'],
  },
  {
    id: 't10',
    titleKey: 'calendarPage',
    status: 'review',
    priority: 'low',
    assignee: 'ana',
    points: 3,
    tags: ['react'],
  },
];

export interface CalendarEvent {
  id: string;
  titleKey: string;
  /** Day of month in the demo month (2026-08). */
  day: number;
  hour: number;
  durationH: number;
  kind: 'meeting' | 'release' | 'review' | 'focus';
}

export const events: CalendarEvent[] = [
  {
    id: 'e1',
    titleKey: 'standup',
    day: 3,
    hour: 9,
    durationH: 1,
    kind: 'meeting',
  },
  {
    id: 'e2',
    titleKey: 'designReview',
    day: 4,
    hour: 14,
    durationH: 2,
    kind: 'review',
  },
  {
    id: 'e3',
    titleKey: 'release',
    day: 6,
    hour: 16,
    durationH: 1,
    kind: 'release',
  },
  {
    id: 'e4',
    titleKey: 'focusBlock',
    day: 10,
    hour: 10,
    durationH: 3,
    kind: 'focus',
  },
  {
    id: 'e5',
    titleKey: 'retro',
    day: 12,
    hour: 15,
    durationH: 1,
    kind: 'meeting',
  },
  {
    id: 'e6',
    titleKey: 'release',
    day: 20,
    hour: 16,
    durationH: 1,
    kind: 'release',
  },
  {
    id: 'e7',
    titleKey: 'onboarding',
    day: 24,
    hour: 11,
    durationH: 2,
    kind: 'meeting',
  },
  {
    id: 'e8',
    titleKey: 'designReview',
    day: 25,
    hour: 14,
    durationH: 2,
    kind: 'review',
  },
];

export interface Message {
  id: string;
  from: 'wei' | 'marta' | 'jonas' | 'li' | 'ana';
  subjectKey: string;
  bodyKey: string;
  minutesAgo: number;
  unread: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'archive';
}

export const messages: Message[] = [
  {
    id: 'm1',
    from: 'marta',
    subjectKey: 'reviewRequest',
    bodyKey: 'reviewRequest',
    minutesAgo: 8,
    unread: true,
    starred: true,
    folder: 'inbox',
  },
  {
    id: 'm2',
    from: 'wei',
    subjectKey: 'cjkFindings',
    bodyKey: 'cjkFindings',
    minutesAgo: 47,
    unread: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: 'm3',
    from: 'jonas',
    subjectKey: 'bundleReport',
    bodyKey: 'bundleReport',
    minutesAgo: 180,
    unread: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: 'm4',
    from: 'li',
    subjectKey: 'themeTokens',
    bodyKey: 'themeTokens',
    minutesAgo: 420,
    unread: false,
    starred: true,
    folder: 'inbox',
  },
  {
    id: 'm5',
    from: 'ana',
    subjectKey: 'demoFeedback',
    bodyKey: 'demoFeedback',
    minutesAgo: 1_440,
    unread: false,
    starred: false,
    folder: 'inbox',
  },
];
