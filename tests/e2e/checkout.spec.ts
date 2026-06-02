import { expect, test } from '@playwright/test';

test.describe('F2 checkout happy path', () => {
  test('product detail → cart → checkout → confirmation', async ({ page }) => {
    await page.goto('/product/p1');
    await expect(page.getByRole('heading', { name: 'زيت زيتون بكر ممتاز' })).toBeVisible();

    await page.getByRole('button', { name: 'أضف إلى السلة' }).click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'سلة المشتريات' })).toBeVisible();
    // Subtotal row in the summary card.
    await expect(page.getByText('الإجمالي الفرعي')).toBeVisible();

    // Add a second unit via the + stepper, then proceed.
    await page.getByRole('button', { name: 'زيادة الكمية' }).first().click();
    await page.getByRole('button', { name: 'متابعة إلى الدفع' }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole('heading', { name: 'الدفع' })).toBeVisible();
    // Defaults are tomorrow / afternoon / wallet — form is valid out of the box.
    const confirmBtn = page.getByRole('button', { name: /تأكيد الطلب/ });
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    await expect(page).toHaveURL(/\/checkout\/success\/SUF-\d{4}-\d{5}$/);
    await expect(page.getByRole('heading', { name: 'تم تأكيد طلبك' })).toBeVisible();
    await expect(page.getByText(/^SUF-\d{4}-\d{5}$/)).toBeVisible();

    // Track CTA points at the tracking placeholder route.
    const trackCta = page.getByRole('link', { name: 'متابعة الطلب' });
    await expect(trackCta).toBeVisible();
  });

  test('empty cart redirects to /cart when typed directly', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByText('سلتك فارغة')).toBeVisible();
  });
});
