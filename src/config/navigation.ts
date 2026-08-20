/**
 * The single source of truth for application routes.
 *
 * The sidebar menu, the breadcrumb trail and the command palette all derive
 * from this list. They used to keep parallel copies, and the breadcrumb's copy
 * fell out of date twice — every batch of new pages rendered raw lowercase
 * segments until someone noticed. A page added here appears in all three.
 */

export interface NavNode {
  /** Absolute path. Group headings use a synthetic key with no page behind it. */
  key: string;
  /** i18n key — never a display string, or the label freezes in one locale. */
  labelKey: string;
  /** Named so the icon component stays out of this module and in the view. */
  icon?: string;
  children?: NavNode[];
  /** Reachable but deliberately absent from the sidebar (auth, exceptions). */
  hidden?: boolean;
  /** Extra words the command palette should match on, as i18n keys. */
  keywordKeys?: string[];
}

export const NAVIGATION: NavNode[] = [
  {
    key: '/dashboard',
    labelKey: 'nav.dashboard',
    icon: 'dashboard',
    children: [
      { key: '/dashboard/analysis', labelKey: 'nav.analysis', icon: 'chart' },
      { key: '/dashboard/monitor', labelKey: 'nav.monitor' },
      { key: '/dashboard/workplace', labelKey: 'nav.workplace' },
    ],
  },
  {
    key: '/components',
    labelKey: 'nav.components',
    icon: 'appstore',
    children: [
      { key: '/components/elements', labelKey: 'nav.elements' },
      { key: '/components/cards', labelKey: 'nav.cards' },
      { key: '/components/feedback', labelKey: 'nav.feedback' },
    ],
  },
  {
    key: '/form',
    labelKey: 'nav.forms',
    icon: 'form',
    children: [
      { key: '/form/basic', labelKey: 'nav.basicForm' },
      { key: '/form/step', labelKey: 'nav.stepForm' },
      { key: '/form/advanced', labelKey: 'nav.advancedForm' },
    ],
  },
  {
    key: '/list',
    labelKey: 'nav.lists',
    icon: 'list',
    children: [
      { key: '/list/basic', labelKey: 'nav.basicList' },
      { key: '/list/card', labelKey: 'nav.cardList' },
      { key: '/list/search', labelKey: 'nav.searchList' },
    ],
  },
  { key: '/table', labelKey: 'nav.table', icon: 'table' },
  {
    key: '/workspace',
    labelKey: 'nav.workspace',
    icon: 'workspace',
    children: [
      { key: '/workspace/kanban', labelKey: 'nav.kanban' },
      { key: '/workspace/calendar', labelKey: 'nav.calendar' },
      { key: '/workspace/inbox', labelKey: 'nav.inbox' },
      { key: '/workspace/files', labelKey: 'nav.files' },
      { key: '/workspace/notifications', labelKey: 'nav.notifications' },
      { key: '/workspace/audit', labelKey: 'nav.audit' },
    ],
  },
  {
    key: '/profile',
    labelKey: 'nav.profile',
    icon: 'profile',
    children: [
      { key: '/profile/basic', labelKey: 'nav.profileBasic' },
      { key: '/profile/advanced', labelKey: 'nav.profileAdvanced' },
    ],
  },
  {
    key: '/account',
    labelKey: 'nav.account',
    icon: 'settings',
    children: [
      { key: '/account/center', labelKey: 'nav.accountCenter' },
      { key: '/account/settings', labelKey: 'nav.settings' },
    ],
  },
  { key: '/ai/assistant', labelKey: 'nav.assistant', icon: 'robot' },
  { key: '/theme-studio', labelKey: 'nav.themeStudio', icon: 'palette' },
  { key: '/billing', labelKey: 'nav.billing', icon: 'billing' },
  { key: '/onboarding', labelKey: 'nav.onboarding', icon: 'rocket' },
  { key: '/access', labelKey: 'nav.access', icon: 'lock' },
  {
    key: '/exception',
    labelKey: 'nav.exceptions',
    icon: 'warning',
    children: [
      { key: '/403', labelKey: 'nav.forbidden' },
      { key: '/500', labelKey: 'nav.serverError' },
      { key: '/not-found', labelKey: 'nav.notFound' },
    ],
  },
  {
    key: '/auth',
    labelKey: 'nav.auth',
    icon: 'user',
    children: [
      { key: '/auth/login', labelKey: 'auth.signIn' },
      { key: '/auth/register', labelKey: 'auth.signUp' },
    ],
  },
];

/** Flattens to leaves only — nodes that actually resolve to a page. */
export function navLeaves(nodes: NavNode[] = NAVIGATION): NavNode[] {
  return nodes.flatMap((n) => (n.children ? navLeaves(n.children) : [n]));
}

/**
 * Longest matching path wins, so /dashboard/analysis beats /dashboard.
 * Returns the empty array for an unknown path rather than guessing.
 */
export function matchNav(pathname: string): NavNode[] {
  const trail: NavNode[] = [];

  const walk = (nodes: NavNode[], ancestors: NavNode[]): void => {
    for (const node of nodes) {
      const isMatch =
        pathname === node.key || pathname.startsWith(`${node.key}/`);
      if (node.children) {
        walk(node.children, isMatch ? [...ancestors, node] : ancestors);
      }
      if (isMatch && !node.children) {
        const candidate = [...ancestors, node];
        if (candidate.at(-1)!.key.length > (trail.at(-1)?.key.length ?? -1)) {
          trail.length = 0;
          trail.push(...candidate);
        }
      }
    }
  };

  walk(NAVIGATION, []);
  return trail;
}

/** The selected sidebar key for a path, or undefined when nothing matches. */
export function activeNavKey(pathname: string): string | undefined {
  return matchNav(pathname).at(-1)?.key;
}
