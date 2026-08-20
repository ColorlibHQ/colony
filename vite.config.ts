import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

// plugin-react (not -swc): Vite 8 runs the React transform through Rolldown's
// Oxc pipeline, which is faster than the SWC plugin when no SWC plugins are used.
import react from '@vitejs/plugin-react';
// From 'vitest/config', not 'vite' — Vitest 4 no longer augments Vite's
// UserConfig type, so the `test` block only type-checks via this entry.
import { defineConfig } from 'vitest/config';

/**
 * Copies demo-only static files into the build.
 *
 * They cannot live in `public/`, which Vite copies into every build. The demo's
 * robots.txt closes the whole site to crawlers — correct for a demo behind an
 * SPA fallback, and actively harmful in a real deployment, where it would
 * silently deindex the user's own app. Same for the MSW worker, which has no
 * business in a production bundle.
 */
function demoAssets() {
  return {
    name: 'colony:demo-assets',
    apply: 'build' as const,
    closeBundle() {
      if (process.env.VITE_ENABLE_MSW !== 'true') return;
      const from = fileURLToPath(new URL('./demo-public', import.meta.url));
      const to = fileURLToPath(new URL('./dist', import.meta.url));
      if (existsSync(from)) cpSync(from, to, { recursive: true });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), demoAssets()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5273,
    open: false,
  },

  preview: {
    port: 5274,
  },

  build: {
    target: 'es2022',
    sourcemap: false,
    // Surfaced in CI so bundle regressions fail loudly rather than drifting.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Only React is pinned to a manual chunk: it is on the critical path
        // for every route and its hash should stay stable across releases.
        // antd and Recharts are deliberately NOT grouped — grouping them put
        // Recharts on the critical path for chart-less routes (measured:
        // Workplace pulled 1,610 kB with no chart on the page).
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react';
          }
          return;
        },
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    exclude: ['**/node_modules/**', '**/dist/**', './e2e/**'],
  },
});
