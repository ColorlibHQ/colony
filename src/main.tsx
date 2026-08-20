import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import { Providers } from '@/app/Providers';
import { router } from '@/app/router';
import { initI18n } from '@/i18n';
import '@/styles/global.css';

async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'true')
    return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

void Promise.all([enableMocking(), initI18n()]).then(() => {
  createRoot(rootEl).render(
    <StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </StrictMode>,
  );
});
