import { expect, test } from '@playwright/test';

test.describe('kanban', () => {
  test('shows every column with its task count', async ({ page }) => {
    await page.goto('/workspace/kanban');
    for (const col of ['Backlog', 'In progress', 'In review', 'Done']) {
      await expect(page.getByText(col, { exact: true })).toBeVisible();
    }
  });

  /**
   * Keyboard dragging is why this uses dnd-kit rather than the native HTML5
   * drag API, which offers none. Space picks up, arrows move, Space drops.
   */
  test('a card can be moved with the keyboard alone', async ({ page }) => {
    await page.goto('/workspace/kanban');
    const backlog = page.locator('[data-column="backlog"]');
    const progress = page.locator('[data-column="progress"]');

    // The route is lazy-loaded, and .count() does not auto-wait — asserting a
    // count first is what makes the rest of this deterministic.
    await expect(backlog.locator('.ant-card')).toHaveCount(3);
    await expect(progress.locator('.ant-card')).toHaveCount(2);

    // dnd-kit puts the listeners on the wrapper it renders as role=button,
    // not on the antd Card inside it.
    await backlog.locator('[role="button"]').first().focus();

    // dnd-kit needs a tick between pick-up, move and drop. Rather than sleep,
    // wait on its own live region — which doubles as proof the screen-reader
    // announcements exist.
    const announcer = page.getByRole('status').first();

    await page.keyboard.press('Space');
    await expect(announcer).toContainText(/was moved over/);

    await page.keyboard.press('ArrowRight');
    await expect(announcer).toContainText(/droppable area t1/);

    await page.keyboard.press('Space');

    await expect(backlog.locator('.ant-card')).toHaveCount(2);
    await expect(progress.locator('.ant-card')).toHaveCount(3);
  });
});

test.describe('calendar', () => {
  test('renders a month grid with events', async ({ page }) => {
    await page.goto('/workspace/calendar');
    await expect(page.getByRole('grid')).toBeVisible();
    await expect(page.getByText('Daily standup').first()).toBeVisible();
  });

  test('switches to the agenda view', async ({ page }) => {
    await page.goto('/workspace/calendar');
    await page.locator('.ant-segmented-item', { hasText: 'Agenda' }).click();
    await expect(page.getByRole('grid')).toHaveCount(0);
    await expect(page.getByText('Release window').first()).toBeVisible();
  });
});

test.describe('inbox', () => {
  test('opening a message marks it read and updates the badge', async ({
    page,
  }) => {
    await page.goto('/workspace/inbox');
    const badge = page.locator('.ant-badge-count').first();
    await expect(badge).toContainText('2');

    // Open the second (unread) message.
    await page.locator('.ant-list-item').nth(1).click();
    await expect(badge).toContainText('1');
  });

  test('selecting a message shows its body', async ({ page }) => {
    await page.goto('/workspace/inbox');
    await page.locator('.ant-list-item').nth(2).click();
    await expect(page.getByText(/MSW was in the production build/)).toBeVisible();
  });

  test('search filters the list', async ({ page }) => {
    await page.goto('/workspace/inbox');
    await page.getByPlaceholder('Search messages').fill('bundle');
    await expect(page.locator('.ant-list-item')).toHaveCount(1);
  });
});
