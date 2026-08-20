import { defineConfig, devices } from '@playwright/test';

const PORT = 5273;

/**
 * E2E runs against a real production build, not the dev server: dev-only
 * behaviour (unminified React warnings, eager module graph, no chunk splitting)
 * hides the failures that actually reach users.
 *
 * `build:demo` is used because the mock API has to exist for the table specs —
 * that is the same artifact the hosted demo serves.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: `pnpm build:demo && pnpm vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
