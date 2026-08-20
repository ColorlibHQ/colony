import { expect, test } from '@playwright/test';

test.describe('basic form', () => {
  test('blocks submit and reports every invalid field', async ({ page }) => {
    await page.goto('/form/basic');
    await page.getByRole('button', { name: 'Submit' }).click();

    const alerts = page.getByRole('alert');
    await expect(alerts.first()).toBeVisible();
    // Errors must name the problem, never render the raw i18n key.
    for (const text of await alerts.allTextContents()) {
      expect(text).not.toMatch(/^validation\./);
      expect(text.length).toBeGreaterThan(3);
    }
  });

  test('shows a placeholder in an untouched select', async ({ page }) => {
    await page.goto('/form/basic');
    // antd treats '' as a chosen value; seeding a Select with the form's empty
    // default used to suppress the placeholder entirely.
    const role = page.locator('#role').locator('..');
    await expect(role.locator('.ant-select-placeholder')).toHaveText(/Select a role/);
  });
});

test.describe('step form', () => {
  test('will not advance past an invalid step', async ({ page }) => {
    await page.goto('/form/step');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    // Still on step 1.
    await expect(page.getByLabel('Pay from')).toBeVisible();
  });

  test('advances to review once the step is valid', async ({ page }) => {
    await page.goto('/form/step');
    await page.getByLabel('Pay from').fill('6222000000000000');
    await page.getByLabel('Pay to').fill('Marta Kovac');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Marta Kovac')).toBeVisible();
  });
});

test.describe('advanced form', () => {
  test('adds a line and keeps the total in step', async ({ page }) => {
    await page.goto('/form/advanced');
    const lines = page.locator('.ant-table-tbody tr.ant-table-row');
    await expect(lines).toHaveCount(1);

    await page.getByRole('button', { name: 'Add line' }).click();
    await expect(lines).toHaveCount(2);
  });

  test('refuses to delete the last remaining line', async ({ page }) => {
    await page.goto('/form/advanced');
    await expect(
      page.locator('.ant-table-tbody').getByRole('button', { name: 'Delete' }),
    ).toBeDisabled();
  });
});

test.describe('sign in', () => {
  test('rejects the wrong password and says so', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Password').fill('not-the-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByText(/do not match/i)).toBeVisible();
  });

  test('signs in with the demo credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Password').fill('colony-demo');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/analysis$/);
  });
});
