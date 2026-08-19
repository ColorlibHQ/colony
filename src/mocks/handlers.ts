import { http, HttpResponse } from 'msw';

/**
 * Mock API surface.
 *
 * MSW rather than a dev-server middleware on purpose: the same handlers run in
 * `pnpm dev`, in Vitest, and in the deployed demo — so the public demo is fully
 * interactive instead of a dead shell.
 */
export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
];
