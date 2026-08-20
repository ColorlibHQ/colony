import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/** Sets the persisted role, then reloads so the guards see it on boot. */
async function useRole(page: Page, role: string) {
  await page.goto('/');
  await page.evaluate(
    (r) =>
      localStorage.setItem(
        'colony.auth',
        JSON.stringify({ state: { role: r }, version: 0 }),
      ),
    role,
  );
}

test.describe('access control', () => {
  test('an owner reaches every guarded page', async ({ page }) => {
    await useRole(page, 'owner');
    for (const route of ['/table', '/access', '/account/settings', '/form/advanced']) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`${route}$`));
    }
  });

  test('a viewer is redirected to 403 and told what was refused', async ({
    page,
  }) => {
    await useRole(page, 'viewer');
    await page.goto('/access');
    await expect(page).toHaveURL(/\/403$/);
    // An anonymous wall is worse than one that names the path.
    await expect(page.getByText('/access')).toBeVisible();
  });

  test('/403 itself stays reachable for a denied role', async ({ page }) => {
    // A guarded 403 would redirect to itself forever.
    await useRole(page, 'viewer');
    await page.goto('/403');
    await expect(page).toHaveURL(/\/403$/);
    await expect(page.locator('.ant-result-title')).toHaveText('403');
  });

  test('the sidebar hides what the role cannot reach', async ({ page }) => {
    await useRole(page, 'owner');
    await page.goto('/dashboard/analysis');
    const sider = page.locator('.ant-layout-sider');
    await expect(sider.getByText('Access control')).toBeVisible();

    await useRole(page, 'viewer');
    await page.goto('/dashboard/analysis');
    await expect(sider.getByText('Access control')).toHaveCount(0);
  });

  test('the command palette will not offer a page that would 403', async ({
    page,
  }) => {
    await useRole(page, 'viewer');
    await page.goto('/dashboard/analysis');
    await expect(
      page.getByRole('button', { name: /command palette/i }),
    ).toBeVisible();

    await page.keyboard.press('ControlOrMeta+k');
    await page.getByRole('combobox').fill('access control');
    await expect(page.getByRole('option')).toHaveCount(0);
  });

  test('revoking a permission takes effect without a reload', async ({
    page,
  }) => {
    await useRole(page, 'owner');
    await page.goto('/access');

    const sider = page.locator('.ant-layout-sider');
    await expect(sider.getByText('Table')).toBeVisible();

    // Switch the matrix to the owner row and revoke orders:view.
    await page.getByRole('checkbox', { name: 'Orders View' }).click();
    await expect(sider.getByText('Table')).toHaveCount(0);
  });

  /**
   * The matrix selector used to be bound to the signed-in role, so clicking
   * "Editor" made you one and the guard instantly bounced you to /403 — you
   * could edit no role but your own.
   */
  test('editing another role does not change who you are', async ({ page }) => {
    await useRole(page, 'owner');
    await page.goto('/access');

    await page.locator('.ant-segmented-item', { hasText: 'Editor' }).click();
    await expect(page).toHaveURL(/\/access$/);
    await expect(page.getByText(/Editor is blocked from/)).toBeVisible();

    // And the sidebar still reflects the OWNER, who is who you still are.
    await expect(
      page.locator('.ant-layout-sider').getByText('Access control'),
    ).toBeVisible();
  });

  test('acting as a role that cannot return here asks first', async ({ page }) => {
    await useRole(page, 'owner');
    await page.goto('/access');
    await page.locator('.ant-segmented-item', { hasText: 'Viewer' }).click();
    await page.getByRole('button', { name: /Act as Viewer/ }).click();
    await expect(page.getByText(/redirected to 403/)).toBeVisible();
  });

  test('the checkbox that would lock you out is disabled', async ({ page }) => {
    await useRole(page, 'owner');
    await page.goto('/access');
    await expect(page.getByRole('checkbox', { name: 'Users View' })).toBeDisabled();
  });
});
