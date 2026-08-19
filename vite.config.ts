import { fileURLToPath, URL } from 'node:url';

// plugin-react (not -swc): Vite 8 runs the React transform through Rolldown's
// Oxc pipeline, which is faster than the SWC plugin when no SWC plugins are used.
import react from '@vitejs/plugin-react';
// From 'vitest/config', not 'vite' — Vitest 4 no longer augments Vite's
// UserConfig type, so the `test` block only type-checks via this entry.
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

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
        // Vite 8 dropped the object form of manualChunks — function only.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/antd/') || id.includes('/@ant-design/')) return 'antd';
          if (id.includes('/recharts/') || id.includes('/d3-')) return 'charts';
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router/') ||
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
