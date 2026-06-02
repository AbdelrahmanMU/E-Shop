import { expect, test } from '@playwright/test';

test.describe('F6 admin orders', () => {
  test('renders shell + stats + table with seed orders', async ({ page }) => {
    await page.goto('/admin/orders');

    // PageHeader
    await expect(page.getByRole('heading', { name: 'إدارة الطلبات' })).toBeVisible();
    // Action buttons
    await expect(page.getByRole('button', { name: 'تصدير CSV' })).toBeVisible();
    await expect(page.getByRole('button', { name: /طلب يدوي/ })).toBeVisible();
    // Stats labels — text collides with filter chips and table status chips,
    // so we scope to the first match (which is always the StatCard label).
    for (const label of ['إجمالي الطلبات', 'جديدة', 'قيد التحضير', 'في الطريق', 'مكتملة اليوم']) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
    // At least one seed order should show
    await expect(page.getByText('SUF-2026-04891')).toBeVisible();
  });

  test('filter chip narrows to "new" + URL search-param reflects it', async ({ page }) => {
    await page.goto('/admin/orders');

    await page.getByRole('tab', { name: 'جديد' }).click();
    await expect(page).toHaveURL(/status=new/);

    // Only orders with new status remain (seed has one: SUF-2026-04888).
    await expect(page.getByText('SUF-2026-04888')).toBeVisible();
    await expect(page.getByText('SUF-2026-04891')).toHaveCount(0);
  });

  test('row view button navigates to /tracking/:id', async ({ page }) => {
    await page.goto('/admin/orders');
    const firstViewBtn = page.getByRole('button', { name: 'عرض' }).first();
    await firstViewBtn.click();
    await expect(page).toHaveURL(/\/tracking\/SUF-\d{4}-\d{5}$/);
  });
});
