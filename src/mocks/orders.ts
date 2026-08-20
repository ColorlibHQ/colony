/**
 * A dataset big enough to make server-side paging, sorting and filtering
 * meaningful. Seeded, so page 7 holds the same rows on every reload.
 */

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type OrderChannel =
  'direct' | 'organic' | 'referral' | 'social' | 'email';

export interface Order {
  id: string;
  reference: string;
  customerKey: string;
  customerSeed: number;
  channel: OrderChannel;
  status: OrderStatus;
  amount: number;
  items: number;
  /** ISO date — formatted at render so it follows the active locale. */
  createdAt: string;
}

const STATUSES: OrderStatus[] = ['paid', 'pending', 'refunded', 'failed'];
const CHANNELS: OrderChannel[] = [
  'direct',
  'organic',
  'referral',
  'social',
  'email',
];

/** Both name pools are indexed by the same seed, so a row keeps its identity
 *  across a locale switch instead of becoming a different person. */
export const CUSTOMERS_EN = [
  'Marta Kovac',
  'Jonas Berg',
  'Ana Duarte',
  'Tom Reilly',
  'Sofia Rossi',
  'Ines Marques',
  'Lars Nilsson',
  'Nadia Haddad',
  'Peter Novak',
  'Elena Petrova',
];
export const CUSTOMERS_ZH = [
  '张伟',
  '李娜',
  '王芳',
  '刘洋',
  '陈静',
  '杨磊',
  '赵敏',
  '黄强',
  '周婷',
  '吴鹏',
];

const rand = seeded(880219);

export const orders: Order[] = Array.from({ length: 240 }, (_, i) => {
  const r = rand();
  const day = 1 + Math.floor(rand() * 27);
  const month = 1 + Math.floor(rand() * 8);
  return {
    id: String(i + 1),
    reference: `CLY-${String(10_000 + i * 7).padStart(5, '0')}`,
    customerKey: 'c',
    customerSeed: Math.floor(r * 10),
    channel: CHANNELS[Math.floor(rand() * CHANNELS.length)]!,
    status:
      // Weighted so "paid" dominates, the way real order data does.
      r > 0.72 ? STATUSES[Math.floor(rand() * STATUSES.length)]! : 'paid',
    amount: Math.round(40 + rand() * 2_400),
    items: 1 + Math.floor(rand() * 8),
    createdAt: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
});

export interface OrderQuery {
  page: number;
  pageSize: number;
  search?: string;
  status?: OrderStatus[];
  channel?: OrderChannel[];
  sortBy?: keyof Order;
  sortDir?: 'asc' | 'desc';
}

export interface OrderPage {
  rows: Order[];
  total: number;
  /** Counts per status across the WHOLE filtered set, not just this page —
   *  a summary that only described the visible rows would mislead. */
  facets: Record<OrderStatus, number>;
}

export function queryOrders(q: OrderQuery): OrderPage {
  let rows = orders;

  if (q.search) {
    const needle = q.search.trim().toLowerCase();
    rows = rows.filter(
      (o) =>
        o.reference.toLowerCase().includes(needle) ||
        CUSTOMERS_EN[o.customerSeed]!.toLowerCase().includes(needle) ||
        CUSTOMERS_ZH[o.customerSeed]!.includes(needle),
    );
  }
  if (q.status?.length) {
    rows = rows.filter((o) => q.status!.includes(o.status));
  }
  if (q.channel?.length) {
    rows = rows.filter((o) => q.channel!.includes(o.channel));
  }

  const facets = { paid: 0, pending: 0, refunded: 0, failed: 0 };
  for (const o of rows) facets[o.status] += 1;

  if (q.sortBy) {
    const key = q.sortBy;
    const dir = q.sortDir === 'desc' ? -1 : 1;
    rows = rows.toSorted((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number')
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  const start = (q.page - 1) * q.pageSize;
  return {
    rows: rows.slice(start, start + q.pageSize),
    total: rows.length,
    facets,
  };
}
