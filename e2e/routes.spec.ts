import { expect, test } from '@playwright/test';

import {
  APP_ROUTES,
  AUTH_ROUTES,
  findUntranslatedKeys,
  useLocale,
  watchForErrors,
} from './helpers';

/**
 * Smoke coverage for every route in both locales.
 *
 * This is the suite that would have caught `form.lineItems` shipping as a raw
 * key: it renders, it has no console error, and it still shows the reader an
 * internal identifier.
 */
for (const locale of ['en-US', 'zh-CN'] as const) {
  test.describe(`routes (${locale})`, () => {
    for (const route of APP_ROUTES) {
      test(`/${route} renders cleanly`, async ({ page }) => {
        const errors = watchForErrors(page);
        await useLocale(page, locale);

        await page.goto(`/${route}`);
        await expect(page.locator('.ant-layout').first()).toBeVisible();

        expect(await findUntranslatedKeys(page)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }

    for (const route of AUTH_ROUTES) {
      test(`/${route} renders cleanly`, async ({ page }) => {
        const errors = watchForErrors(page);
        await useLocale(page, locale);

        await page.goto(`/${route}`);
        await expect(page.locator('.auth-grid')).toBeVisible();

        expect(await findUntranslatedKeys(page)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}

test('unknown routes fall through to 404, not a blank page', async ({ page }) => {
  await page.goto('/definitely/not/a/route');
  // Scoped to the title: the exception illustration also renders '404'.
  await expect(page.locator('.ant-result-title')).toHaveText('404');
});

test('the root redirects to the analysis dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/dashboard\/analysis$/);
});
