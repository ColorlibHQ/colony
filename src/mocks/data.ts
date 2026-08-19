/**
 * Demo dataset.
 *
 * Deterministic on purpose — a seeded PRNG rather than Math.random, so the
 * numbers are identical on every reload and in every screenshot. Visual
 * regression tests and marketing captures both depend on that.
 *
 * Locale-aware where it matters: `nameKey` pairs a Western and a Chinese name
 * for the same row, because a Chinese demo populated with "Sarah Chen" reads as
 * a translated Western product rather than one built for the market.
 */

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const rand = seeded(20260819);

export interface TrendPoint {
  label: string;
  revenue: number;
  orders: number;
  visits: number;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const revenueTrend: TrendPoint[] = MONTHS.map((label, i) => ({
  label,
  revenue: Math.round(48_000 + i * 5200 + rand() * 22_000),
  orders: Math.round(320 + i * 26 + rand() * 180),
  visits: Math.round(6_400 + i * 410 + rand() * 2_600),
}));

/** Last 30 days, for sparklines and the monitor stream. */
export const dailyVisits = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.round(2_100 + Math.sin(i / 3) * 480 + rand() * 620),
}));

export interface CategorySlice {
  key: string;
  value: number;
}

export const salesByChannel: CategorySlice[] = [
  { key: 'direct', value: 42_800 },
  { key: 'organic', value: 31_400 },
  { key: 'referral', value: 18_900 },
  { key: 'social', value: 12_600 },
  { key: 'email', value: 8_300 },
];

export const trafficByDevice: CategorySlice[] = [
  { key: 'desktop', value: 58 },
  { key: 'mobile', value: 34 },
  { key: 'tablet', value: 8 },
];

export interface ProductRow {
  id: string;
  sku: string;
  nameKey: string;
  category: string;
  price: number;
  sold: number;
  stock: number;
  status: 'active' | 'low' | 'draft';
}

export const topProducts: ProductRow[] = [
  {
    id: '1',
    sku: 'CLY-1042',
    nameKey: 'aurora',
    category: 'hardware',
    price: 249,
    sold: 1_284,
    stock: 412,
    status: 'active',
  },
  {
    id: '2',
    sku: 'CLY-2237',
    nameKey: 'meridian',
    category: 'software',
    price: 89,
    sold: 968,
    stock: 0,
    status: 'draft',
  },
  {
    id: '3',
    sku: 'CLY-3391',
    nameKey: 'lattice',
    category: 'hardware',
    price: 419,
    sold: 742,
    stock: 38,
    status: 'low',
  },
  {
    id: '4',
    sku: 'CLY-4408',
    nameKey: 'quanta',
    category: 'services',
    price: 1_290,
    sold: 511,
    stock: 120,
    status: 'active',
  },
  {
    id: '5',
    sku: 'CLY-5512',
    nameKey: 'vertex',
    category: 'software',
    price: 149,
    sold: 486,
    stock: 27,
    status: 'low',
  },
  {
    id: '6',
    sku: 'CLY-6620',
    nameKey: 'cobalt',
    category: 'hardware',
    price: 329,
    sold: 402,
    stock: 208,
    status: 'active',
  },
];

export interface ActivityItem {
  id: string;
  actorKey: string;
  actionKey: string;
  target: string;
  minutesAgo: number;
  kind: 'deploy' | 'comment' | 'merge' | 'alert';
}

export const activityFeed: ActivityItem[] = [
  {
    id: 'a1',
    actorKey: 'wei',
    actionKey: 'deployed',
    target: 'api-gateway v2.4.1',
    minutesAgo: 3,
    kind: 'deploy',
  },
  {
    id: 'a2',
    actorKey: 'marta',
    actionKey: 'merged',
    target: '#4821 datatable virtualisation',
    minutesAgo: 18,
    kind: 'merge',
  },
  {
    id: 'a3',
    actorKey: 'jonas',
    actionKey: 'flagged',
    target: 'checkout latency p99',
    minutesAgo: 41,
    kind: 'alert',
  },
  {
    id: 'a4',
    actorKey: 'li',
    actionKey: 'commented',
    target: '#4802 theme tokens',
    minutesAgo: 76,
    kind: 'comment',
  },
  {
    id: 'a5',
    actorKey: 'ana',
    actionKey: 'deployed',
    target: 'web v8.0.3',
    minutesAgo: 133,
    kind: 'deploy',
  },
];

export interface ServiceHealth {
  key: string;
  uptime: number;
  latencyMs: number;
  status: 'healthy' | 'degraded' | 'down';
}

export const services: ServiceHealth[] = [
  { key: 'api', uptime: 99.98, latencyMs: 84, status: 'healthy' },
  { key: 'web', uptime: 99.95, latencyMs: 121, status: 'healthy' },
  { key: 'worker', uptime: 98.72, latencyMs: 340, status: 'degraded' },
  { key: 'database', uptime: 99.99, latencyMs: 12, status: 'healthy' },
];

export interface Project {
  id: string;
  nameKey: string;
  progress: number;
  members: number;
  dueInDays: number;
}

export const projects: Project[] = [
  { id: 'p1', nameKey: 'datatable', progress: 72, members: 5, dueInDays: 9 },
  { id: 'p2', nameKey: 'themeStudio', progress: 41, members: 3, dueInDays: 21 },
  { id: 'p3', nameKey: 'docsSite', progress: 88, members: 2, dueInDays: 4 },
  { id: 'p4', nameKey: 'rbac', progress: 15, members: 4, dueInDays: 34 },
];
