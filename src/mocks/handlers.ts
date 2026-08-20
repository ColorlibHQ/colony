import { http, HttpResponse } from 'msw';

import { queryOrders, type OrderChannel, type OrderStatus } from './orders';

/**
 * Mock API surface.
 *
 * MSW rather than a dev-server middleware on purpose: the same handlers run in
 * `pnpm dev`, in Vitest, and in the deployed demo — so the public demo is fully
 * interactive instead of a dead shell.
 */
export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),

  http.get('/api/orders', async ({ request }) => {
    const url = new URL(request.url);
    const p = url.searchParams;

    // A little latency so loading states are visible in the demo rather than
    // flashing past — this is the shape real consumers will see.
    await new Promise((r) => setTimeout(r, 220));

    const result = queryOrders({
      page: Number(p.get('page') ?? 1),
      pageSize: Number(p.get('pageSize') ?? 10),
      search: p.get('search') ?? undefined,
      status: p.getAll('status') as OrderStatus[],
      channel: p.getAll('channel') as OrderChannel[],
      sortBy: (p.get('sortBy') as never) ?? undefined,
      sortDir: (p.get('sortDir') as 'asc' | 'desc') ?? undefined,
    });

    return HttpResponse.json(result);
  }),
];
