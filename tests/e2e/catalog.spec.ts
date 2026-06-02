import { expect, test } from '@playwright/test';

test.describe('F1 catalog happy path', () => {
  test('Home → category tile → catalog filtered → product detail', async ({ page }) => {
    await page.goto('/');

    // Click the first category tile (we test by emoji + link inside the categories row).
    // Each tile is a link with the category's Arabic name as accessible label.
    const oliveTile = page.getByRole('link', { name: 'زيت وزيتون' }).first();
    await expect(oliveTile).toBeVisible();
    await oliveTile.click();

    await expect(page).toHaveURL(/\/catalog\/olive/);
    await expect(page.getByRole('heading', { name: 'زيت وزيتون' })).toBeVisible();

    // The grid should only show olive products.
    const oliveProduct = page.getByRole('link', { name: 'زيت زيتون بكر ممتاز' });
    await expect(oliveProduct).toBeVisible();
    await oliveProduct.click();

    await expect(page).toHaveURL(/\/product\/p1/);
    await expect(page.getByRole('heading', { name: 'زيت زيتون بكر ممتاز' })).toBeVisible();
    // Price formatted as `285 ج.م` for AR locale.
    await expect(page.getByText('285 ج.م')).toBeVisible();
    // Old price is rendered with strike-through.
    await expect(page.getByText('320 ج.م')).toBeVisible();
    // Add-to-cart button.
    await expect(page.getByRole('button', { name: 'أضف إلى السلة' })).toBeVisible();
  });

  test('filter chip narrows the catalog grid to handmade items', async ({ page }) => {
    await page.goto('/catalog');

    // The chip count includes "الكل · يدوي · عضوي · موسم محدود · الأكثر مبيعاً" — pick handmade.
    await page.getByRole('tab', { name: 'يدوي' }).click();

    // Only one handmade product in the mock set: p2 (Premium Tahini / طحينة بيضاء فاخرة).
    await expect(page.getByRole('link', { name: 'طحينة بيضاء فاخرة' })).toBeVisible();
    // A non-handmade product should be gone (p4 Wild Thyme).
    await expect(page.getByRole('link', { name: 'زعتر بري مع سمسم' })).toHaveCount(0);
  });
});
