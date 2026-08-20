import type { Page } from '@playwright/test';

/**
 * Every app route, in nav order. Kept here rather than inline so a new page
 * added without a spec still gets smoke coverage from routes.spec.ts.
 */
export const APP_ROUTES = [
  'dashboard/analysis', 'dashboard/monitor', 'dashboard/workplace',
  'components/elements', 'components/cards', 'components/feedback',
  'form/basic', 'form/step', 'form/advanced',
  'list/basic', 'list/card', 'list/search',
  'profile/basic', 'profile/advanced', 'table',
  'account/center', 'account/settings', 'ai/assistant', 'theme-studio',
  '403', '500', 'this-route-does-not-exist',
] as const;

export const AUTH_ROUTES = [
  'auth/login', 'auth/register', 'auth/register/done',
] as const;

/** Collects console errors and uncaught exceptions for the life of the page. */
export function watchForErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

/**
 * Any leaf node whose entire text looks like an i18n key (`form.lineItems`)
 * means a translation is missing — the exact bug shipped on form/advanced.
 */
export async function findUntranslatedKeys(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter(
        (n) =>
          n.children.length === 0 &&
          /^[a-z]+\.[a-zA-Z]+$/.test((n.textContent ?? '').trim()),
      )
      .map((n) => (n.textContent ?? '').trim()),
  );
}

/** Sets the persisted locale, then reloads so i18n picks it up on boot. */
export async function useLocale(page: Page, locale: string): Promise<void> {
  await page.goto('/');
  await page.evaluate((l) => localStorage.setItem('colony.locale', l), locale);
}
