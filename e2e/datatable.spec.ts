import { expect, test } from '@playwright/test';

/**
 * DataTable is the component the "no ProComponents" claim rests on, so its
 * behaviour is pinned rather than eyeballed.
 *
 * Two antd DOM details matter here and cost real debugging time:
 *  - the first <tr> in tbody is a hidden `.ant-table-measure-row`, so row
 *    selectors must be scoped to `tr.ant-table-row`;
 *  - the real checkbox <input> is visually hidden — click `.ant-checkbox`.
 */
const rows = (page: import('@playwright/test').Page) =>
  page.locator('.ant-table-tbody tr.ant-table-row');

const amounts = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const heads = [...document.querySelectorAll('.ant-table-thead th')].map(
      (h) => h.textContent?.trim() ?? '',
    );
    const i = heads.findIndex((h) => /Amount/.test(h));
    return [...document.querySelectorAll('.ant-table-tbody tr.ant-table-row')]
      .map((r) => r.querySelectorAll('td')[i]?.textContent ?? '')
      .map((s) => Number(s.replace(/[^0-9.]/g, '')));
  });

test.describe('DataTable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/table');
    await expect(rows(page)).toHaveCount(10);
  });

  test('pages through server-side results', async ({ page }) => {
    const first = await rows(page).first().textContent();
    await page.getByTitle('2', { exact: true }).first().click();
    await expect
      .poll(async () => rows(page).first().textContent())
      .not.toBe(first);
    await expect(page.locator('.ant-pagination-total-text')).toContainText('240');
  });

  test('sorts ascending then descending on the server', async ({ page }) => {
    const header = page.locator('.ant-table-thead th', { hasText: 'Amount' });

    await header.click();
    await expect.poll(async () => {
      const v = await amounts(page);
      return v.every((n, i) => i === 0 || v[i - 1]! <= n);
    }).toBe(true);

    await header.click();
    await expect.poll(async () => {
      const v = await amounts(page);
      return v.every((n, i) => i === 0 || v[i - 1]! >= n);
    }).toBe(true);
  });

  test('filters by status and shows facet counts for the whole set', async ({
    page,
  }) => {
    await page.locator('.ant-select').first().click();
    const option = page.locator('.ant-select-item-option').first();
    // Counts describe every matching row, not just the visible page.
    await expect(option).toContainText(/\(\d+\)/);
    await option.click();
    await page.keyboard.press('Escape');

    await expect
      .poll(async () =>
        (await page.locator('.ant-pagination-total-text').textContent()) ?? '',
      )
      .not.toContain('240');
  });

  test('searches by reference', async ({ page }) => {
    await page.getByPlaceholder(/Search reference/i).fill('CLY-10007');
    await expect(rows(page)).toHaveCount(1);
  });

  test('hiding a column removes it from the table', async ({ page }) => {
    await expect(page.locator('.ant-table-thead th', { hasText: 'Channel' })).toHaveCount(1);
    await page.getByRole('button', { name: 'Columns' }).click();
    await page.getByRole('menuitem').filter({ hasText: 'Channel' }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.ant-table-thead th', { hasText: 'Channel' })).toHaveCount(0);
  });

  test('selecting rows reveals the bulk action bar', async ({ page }) => {
    await expect(page.getByRole('status')).toHaveCount(0);

    await rows(page).nth(0).locator('.ant-checkbox').click();
    await rows(page).nth(1).locator('.ant-checkbox').click();
    await expect(page.getByRole('status')).toContainText('2 selected');

    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('select-all covers the visible page', async ({ page }) => {
    await page.locator('.ant-table-thead .ant-checkbox').click();
    await expect(page.getByRole('status')).toContainText('10 selected');
  });

  test('exports a CSV of the visible columns', async ({ page }) => {
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export' }).first().click();
    const file = await download;
    expect(file.suggestedFilename()).toBe('colony-orders.csv');
  });
});
