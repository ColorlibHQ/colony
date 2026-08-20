import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const LIGHT_BG = 'rgb(247, 248, 250)';
const DARK_BG = 'rgb(20, 22, 27)';

const bg = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

const attr = (page: Page, name: string) =>
  page.evaluate((n) => document.documentElement.getAttribute(n), name);

test.describe('theme', () => {
  /**
   * The three-state contract from tokens.css. "system" must NOT stamp
   * data-theme — leaving the attribute off is what keeps the
   * prefers-color-scheme media query authoritative.
   */
  test('system mode follows the OS and leaves data-theme unstamped', async ({
    browser,
  }) => {
    for (const [scheme, expected] of [
      ['light', LIGHT_BG],
      ['dark', DARK_BG],
    ] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/dashboard/analysis');
      expect(await attr(page, 'data-theme')).toBeNull();
      expect(await bg(page)).toBe(expected);
      await ctx.close();
    }
  });

  test('an explicit light choice beats a dark OS', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.evaluate(() =>
      localStorage.setItem(
        'colony.preferences',
        JSON.stringify({
          state: {
            colorMode: 'light',
            presetId: 'azure',
            density: 'comfortable',
            siderCollapsed: false,
          },
          version: 0,
        }),
      ),
    );
    await page.goto('/dashboard/analysis');
    expect(await attr(page, 'data-theme')).toBe('light');
    expect(await bg(page)).toBe(LIGHT_BG);
    await ctx.close();
  });

  test('switching mode from the header updates the ground', async ({ page }) => {
    await page.goto('/dashboard/analysis');
    await page.getByRole('button', { name: 'Theme', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await expect.poll(() => bg(page)).toBe(DARK_BG);
    expect(await attr(page, 'data-theme')).toBe('dark');
  });

  test('preferences survive a reload', async ({ page }) => {
    await page.goto('/dashboard/analysis');
    await page.getByRole('button', { name: 'Density' }).click();
    await page.getByRole('menuitem', { name: 'Condensed' }).click();
    await expect.poll(() => attr(page, 'data-density')).toBe('condensed');

    await page.reload();
    expect(await attr(page, 'data-density')).toBe('condensed');
  });

  /**
   * The tooltip regression: opening a header menu used to leave its tooltip
   * floating on top of the menu it had just opened.
   */
  test('a header tooltip withdraws when its menu opens', async ({ page }) => {
    await page.goto('/dashboard/analysis');
    const trigger = page.getByRole('button', { name: 'Theme', exact: true });

    await trigger.hover();
    await expect(page.locator('.ant-tooltip:visible')).toHaveCount(1);

    await trigger.click();
    await expect(page.locator('.ant-dropdown:visible')).toHaveCount(1);
    await expect(page.locator('.ant-tooltip:visible')).toHaveCount(0);
  });
});

test.describe('typography', () => {
  /** Han glyphs need more leading and size than Latin at the same scale. */
  test('CJK metrics replace the Latin scale under zh-CN', async ({ page }) => {
    const read = () =>
      page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        return {
          lang: document.documentElement.lang,
          size: cs.getPropertyValue('--text-base').trim(),
          leading: cs.getPropertyValue('--leading-normal').trim(),
          font: getComputedStyle(document.body).fontFamily.split(',')[0]?.trim(),
        };
      });

    await page.goto('/dashboard/analysis');
    const latin = await read();
    expect(latin.size).toBe('14px');
    expect(latin.leading).toBe('1.55');

    await page.getByRole('button', { name: 'Language' }).click();
    await page.getByRole('menuitem', { name: '简体中文' }).click();
    await expect.poll(async () => (await read()).lang).toBe('zh-CN');

    const cjk = await read();
    expect(cjk.size).toBe('15px');
    expect(cjk.leading).toBe('1.75');
    expect(cjk.font).toContain('Noto Sans SC');
  });
});
