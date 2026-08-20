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

export interface FileNode {
  id: string;
  nameKey: string;
  kind: 'folder' | 'image' | 'doc' | 'code' | 'archive';
  sizeKb: number;
  daysAgo: number;
  owner: 'wei' | 'marta' | 'jonas' | 'li' | 'ana';
}

export const files: FileNode[] = [
  {
    id: 'f1',
    nameKey: 'brand',
    kind: 'folder',
    sizeKb: 0,
    daysAgo: 2,
    owner: 'li',
  },
  {
    id: 'f2',
    nameKey: 'screenshots',
    kind: 'folder',
    sizeKb: 0,
    daysAgo: 4,
    owner: 'ana',
  },
  {
    id: 'f3',
    nameKey: 'themeTokens',
    kind: 'code',
    sizeKb: 12,
    daysAgo: 1,
    owner: 'li',
  },
  {
    id: 'f4',
    nameKey: 'auditReport',
    kind: 'doc',
    sizeKb: 340,
    daysAgo: 3,
    owner: 'wei',
  },
  {
    id: 'f5',
    nameKey: 'heroShot',
    kind: 'image',
    sizeKb: 2_480,
    daysAgo: 5,
    owner: 'ana',
  },
  {
    id: 'f6',
    nameKey: 'bundleTrace',
    kind: 'archive',
    sizeKb: 15_900,
    daysAgo: 6,
    owner: 'jonas',
  },
  {
    id: 'f7',
    nameKey: 'localeExport',
    kind: 'code',
    sizeKb: 88,
    daysAgo: 8,
    owner: 'wei',
  },
  {
    id: 'f8',
    nameKey: 'pressKit',
    kind: 'archive',
    sizeKb: 42_100,
    daysAgo: 14,
    owner: 'marta',
  },
];

export type NotificationKind = 'deploy' | 'mention' | 'security' | 'billing';

export interface Notification {
  id: string;
  kind: NotificationKind;
  titleKey: string;
  bodyKey: string;
  minutesAgo: number;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: 'n1',
    kind: 'deploy',
    titleKey: 'deployOk',
    bodyKey: 'deployOk',
    minutesAgo: 4,
    read: false,
  },
  {
    id: 'n2',
    kind: 'mention',
    titleKey: 'mentioned',
    bodyKey: 'mentioned',
    minutesAgo: 22,
    read: false,
  },
  {
    id: 'n3',
    kind: 'security',
    titleKey: 'newDevice',
    bodyKey: 'newDevice',
    minutesAgo: 95,
    read: false,
  },
  {
    id: 'n4',
    kind: 'billing',
    titleKey: 'invoiceReady',
    bodyKey: 'invoiceReady',
    minutesAgo: 260,
    read: true,
  },
  {
    id: 'n5',
    kind: 'deploy',
    titleKey: 'deployFailed',
    bodyKey: 'deployFailed',
    minutesAgo: 640,
    read: true,
  },
  {
    id: 'n6',
    kind: 'mention',
    titleKey: 'reviewAssigned',
    bodyKey: 'reviewAssigned',
    minutesAgo: 1_500,
    read: true,
  },
];

export interface AuditEntry {
  id: string;
  actor: 'wei' | 'marta' | 'jonas' | 'li' | 'ana';
  actionKey: string;
  target: string;
  ip: string;
  minutesAgo: number;
  severity: 'info' | 'warning' | 'critical';
  before?: string;
  after?: string;
}

export const auditLog: AuditEntry[] = [
  {
    id: 'a1',
    actor: 'jonas',
    actionKey: 'permissionChanged',
    target: 'role:editor',
    ip: '10.4.2.18',
    minutesAgo: 12,
    severity: 'critical',
    before: 'orders:update',
    after: '—',
  },
  {
    id: 'a2',
    actor: 'marta',
    actionKey: 'settingUpdated',
    target: 'billing.currency',
    ip: '10.4.2.31',
    minutesAgo: 48,
    severity: 'warning',
    before: 'USD',
    after: 'EUR',
  },
  {
    id: 'a3',
    actor: 'wei',
    actionKey: 'userInvited',
    target: 'nadia@example.com',
    ip: '10.4.9.7',
    minutesAgo: 130,
    severity: 'info',
  },
  {
    id: 'a4',
    actor: 'li',
    actionKey: 'apiKeyCreated',
    target: 'key_live_8f2a',
    ip: '10.4.2.44',
    minutesAgo: 300,
    severity: 'critical',
  },
  {
    id: 'a5',
    actor: 'ana',
    actionKey: 'exportRun',
    target: 'orders.csv',
    ip: '10.4.7.12',
    minutesAgo: 520,
    severity: 'info',
  },
  {
    id: 'a6',
    actor: 'jonas',
    actionKey: 'loginFailed',
    target: 'jonas@example.com',
    ip: '203.0.113.9',
    minutesAgo: 900,
    severity: 'warning',
  },
  {
    id: 'a7',
    actor: 'marta',
    actionKey: 'settingUpdated',
    target: 'security.2fa',
    ip: '10.4.2.31',
    minutesAgo: 1_400,
    severity: 'warning',
    before: 'off',
    after: 'required',
  },
];

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: 'paid' | 'due' | 'failed';
  daysAgo: number;
}

export const invoices: Invoice[] = [
  { id: 'i1', number: 'INV-2026-0812', amount: 348, status: 'due', daysAgo: 2 },
  {
    id: 'i2',
    number: 'INV-2026-0712',
    amount: 348,
    status: 'paid',
    daysAgo: 33,
  },
  {
    id: 'i3',
    number: 'INV-2026-0612',
    amount: 290,
    status: 'paid',
    daysAgo: 63,
  },
  {
    id: 'i4',
    number: 'INV-2026-0512',
    amount: 290,
    status: 'failed',
    daysAgo: 94,
  },
  {
    id: 'i5',
    number: 'INV-2026-0412',
    amount: 290,
    status: 'paid',
    daysAgo: 124,
  },
];
