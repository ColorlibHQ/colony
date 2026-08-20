import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const palette = (page: Page) =>
  page.getByRole('combobox');

test.describe('command palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/analysis');
    // The shortcut is bound in an effect, so the listener does not exist until
    // React has mounted. Waiting for the trigger proves the layout is live.
    await expect(
      page.getByRole('button', { name: /command palette/i }),
    ).toBeVisible();
  });

  test('opens with the keyboard shortcut and closes with Escape', async ({
    page,
  }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await expect(palette(page)).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(palette(page)).toBeHidden();
  });

  test('opens from the visible header trigger', async ({ page }) => {
    // A shortcut nobody can discover is not a feature.
    await page.getByRole('button', { name: /command palette/i }).click();
    await expect(palette(page)).toBeFocused();
  });

  test('navigates to a page chosen with the keyboard', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await palette(page).fill('theme studio');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/theme-studio$/);
  });

  test('finds a page by subsequence, not just prefix', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await palette(page).fill('thst'); // Theme Studio
    await expect(page.getByRole('option').first()).toContainText('Theme Studio');
  });

  test('runs a theme command without leaving the page', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await palette(page).fill('cinnabar');
    await page.keyboard.press('Enter');

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            getComputedStyle(
              document.querySelector('.ant-layout-sider [aria-hidden="true"]')!,
            ).backgroundColor,
        ),
      )
      .toBe('rgb(198, 58, 40)');
    await expect(page).toHaveURL(/\/dashboard\/analysis$/);
  });

  test('arrow keys move the active option', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    const first = page.getByRole('option').first();
    await expect(first).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(first).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('option').nth(1)).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  /** Score-ordering alone interleaves groups, printing "Go to" twice. */
  test('shows each group heading exactly once', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await palette(page).fill('th');
    const headings = await page
      .locator('#command-palette-list li > div:first-child')
      .filter({ hasText: /^(Go to|Appearance|Language)$/ })
      .allTextContents();
    expect(headings).toEqual([...new Set(headings)]);
  });

  test('says so when nothing matches', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await palette(page).fill('qqqqqqq');
    await expect(page.getByText('No matching command')).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(0);
  });

  test('does not resume a stale query when reopened', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+k');
    await palette(page).fill('cards');
    await page.keyboard.press('Escape');

    await page.keyboard.press('ControlOrMeta+k');
    await expect(palette(page)).toHaveValue('');
  });
});
