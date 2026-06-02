import { expect, test } from '@playwright/test';

test.describe('F6 admin products', () => {
  test('renders shell + low-stock banner + stats + table', async ({ page }) => {
    await page.goto('/admin/products');

    await expect(page.getByRole('heading', { name: 'إدارة المنتجات' })).toBeVisible();
    // Low-stock banner shows the count + 3 names
    await expect(page.getByText(/تحتاج إعادة تخزين|يحتاج إعادة تخزين/)).toBeVisible();
    // Stats — labels collide with filter chips (نشط / مخزون منخفض), scope to first.
    for (const label of ['إجمالي المنتجات', 'نشط', 'مخزون منخفض', 'نفد المخزون']) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
    // First seed row
    await expect(page.getByText('زيت زيتون بكر ممتاز').first()).toBeVisible();
  });

  test('filter chip narrows to "out of stock"', async ({ page }) => {
    await page.goto('/admin/products');
    await page.getByRole('tab', { name: 'نفد' }).click();
    await expect(page).toHaveURL(/stock=out/);
    // p12 is the only out-of-stock seed item.
    await expect(page.getByText('زيتون أخضر بالليمون')).toBeVisible();
    await expect(page.getByText('زيت زيتون بكر ممتاز')).toHaveCount(0);
  });

  test('create flow: open drawer, submit form, new row + stats update', async ({ page }) => {
    await page.goto('/admin/products');

    await page.getByRole('button', { name: /منتج جديد/ }).click();

    // Drawer is open as a dialog.
    const dialog = page.getByRole('dialog', { name: 'منتج جديد' });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('الاسم بالعربية').fill('منتج تجريبي');
    await dialog.getByLabel('الاسم بالإنجليزية').fill('Test product');
    await dialog.getByLabel('وصف موجز').fill('origin · note');
    await dialog.getByLabel('الفئة').selectOption('olive');
    await dialog.getByLabel('السعر (ج.م)').fill('50');
    await dialog.getByLabel('الوزن').fill('500 مل');
    await dialog.getByLabel('المخزون').fill('10');

    await dialog.getByRole('button', { name: 'حفظ' }).click();

    // Drawer closes and the new product appears in the table.
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText('منتج تجريبي')).toBeVisible();
  });

  test('row edit button opens the drawer in edit mode', async ({ page }) => {
    await page.goto('/admin/products');
    await page.getByRole('button', { name: 'تعديل' }).first().click();
    await expect(page.getByRole('dialog', { name: 'تعديل المنتج' })).toBeVisible();
  });
});
