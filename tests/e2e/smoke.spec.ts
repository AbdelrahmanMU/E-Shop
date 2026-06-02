import { expect, test } from '@playwright/test';

test.describe('F1 smoke', () => {
  test('Home renders Arabic RTL shell with the hero', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');

    await expect(page.getByRole('heading', { name: /نكهات بلدي/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'اكتشف المجموعة' })).toBeVisible();
  });

  test('bottom nav routes through Catalog and Cart placeholder', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'الفئات' }).first().click();
    await expect(page).toHaveURL(/\/catalog/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.getByRole('link', { name: 'السلة' }).first().click();
    await expect(page).toHaveURL(/\/cart/);
  });
});
