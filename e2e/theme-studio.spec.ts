import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * antd v6 scopes its CSS variables to a generated container class rather than
 * :root, so reading --ant-color-primary off documentElement returns "". Probe a
 * painted element instead — which is also what a user actually sees change.
 */
const primaryPaint = (page: Page) =>
  page.evaluate(
    () =>
      getComputedStyle(
        document.querySelector('.ant-btn-primary')!,
      ).backgroundColor,
  );

test.describe('Theme Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-studio');
    await expect(page.getByRole('heading', { name: 'Theme Studio' })).toBeVisible();
  });

  test('applying a preset repaints the whole app, not just the preview', async ({
    page,
  }) => {
    const before = await primaryPaint(page);
    await page.getByRole('button', { name: 'Cinnabar' }).click();
    await expect.poll(() => primaryPaint(page)).not.toBe(before);

    // The sider logo sits outside the preview card. If it did not repaint too,
    // the editor is driving a detached copy of the theme rather than the app's.
    // Asserted against the preset's own hex rather than against the button,
    // whose paint can differ mid-transition.
    const logoBg = () =>
      page.evaluate(
        () =>
          getComputedStyle(
            document.querySelector('.ant-layout-sider [aria-hidden="true"]')!,
          ).backgroundColor,
      );
    await expect.poll(logoBg).toBe('rgb(198, 58, 40)'); // #c63a28, cinnabar
  });

  test('shows a contrast ratio and grades it', async ({ page }) => {
    // Interpolation splits the message across text nodes, so assert on the
    // alert's combined text rather than a single node.
    const alert = page.locator('.ant-alert').first();
    await expect(alert).toContainText(/Contrast \d+\.\d+:1/);
    // Every grade label, including the ones that do not spell out "WCAG".
    await expect(alert).toContainText(/WCAG AAA|WCAG AA|AA large text only|Below WCAG AA/);
  });

  test('the exported file tracks the current tokens', async ({ page }) => {
    await page.getByRole('button', { name: 'Jade' }).click();
    const output = page.locator('textarea[readonly]');
    await expect(output).toHaveValue(/colorPrimary: '#2f7d62'/);
    await expect(output).toHaveValue(/borderRadius: 8/);
  });

  test('choosing a preset discards hand-edited tokens', async ({ page }) => {
    const reset = page.getByRole('button', { name: 'Reset' });
    await expect(reset).toBeDisabled();

    await page.getByRole('slider').first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(reset).toBeEnabled();

    await page.getByRole('button', { name: 'Slate' }).click();
    await expect(reset).toBeDisabled();
  });

  /**
   * Progress defaults to colorInfo rather than colorPrimary, so it stayed
   * antd-blue while every other surface followed the preset. Note the antd v6
   * class rename: .ant-progress-bg (v5) is now .ant-progress-track.
   */
  test('progress bars follow the preset, not antd blue', async ({ page }) => {
    const track = () =>
      page.evaluate(
        () =>
          getComputedStyle(document.querySelector('.ant-progress-track')!)
            .backgroundColor,
      );
    expect(await track()).toBe('rgb(22, 119, 255)');
    await page.getByRole('button', { name: 'Jade' }).click();
    await expect.poll(track).toBe('rgb(47, 125, 98)');
  });

  test('downloads a theme.ts', async ({ page }) => {
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    expect((await download).suggestedFilename()).toBe('theme.ts');
  });
});
