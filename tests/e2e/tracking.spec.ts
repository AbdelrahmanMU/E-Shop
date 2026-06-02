import { expect, test } from '@playwright/test';

test.describe('F3 order tracking', () => {
  test('full happy path lands on tracking with the order ID + map + timeline', async ({ page }) => {
    await page.goto('/product/p1');
    await page.getByRole('button', { name: 'أضف إلى السلة' }).click();
    await page.getByRole('button', { name: 'متابعة إلى الدفع' }).click();
    await page.getByRole('button', { name: /تأكيد الطلب/ }).click();

    await expect(page).toHaveURL(/\/checkout\/success\/SUF-\d{4}-\d{5}$/);

    await page.getByRole('link', { name: 'متابعة الطلب' }).click();
    await expect(page).toHaveURL(/\/tracking\/SUF-\d{4}-\d{5}$/);

    await expect(page.getByRole('heading', { name: 'متابعة الطلب' })).toBeVisible();
    await expect(page.getByText(/^SUF-\d{4}-\d{5}$/)).toBeVisible();
    // Map is rendered.
    await expect(page.getByRole('img', { name: 'map' })).toBeVisible();
    // ETA eyebrow.
    await expect(page.getByText('ARRIVING SOON')).toBeVisible();
    // Timeline eyebrow.
    await expect(page.getByText('مراحل الطلب')).toBeVisible();
    // Driver card.
    await expect(page.getByText('محمد عبد الله')).toBeVisible();
  });

  test('direct visit to an unknown order id shows the not-found state', async ({ page }) => {
    await page.goto('/tracking/SUF-9999-99999');
    await expect(page.getByRole('heading', { name: 'الطلب غير موجود' })).toBeVisible();
  });
});
