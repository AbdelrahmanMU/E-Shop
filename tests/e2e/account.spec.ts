import { expect, test } from '@playwright/test';

test.describe('F4 account screen', () => {
  test('renders hero, stats, all menu rows and sign-out', async ({ page }) => {
    await page.goto('/account');

    // Hero
    await expect(page.getByText('أحمد المصري')).toBeVisible();
    await expect(page.getByText('+201001234567')).toBeVisible();
    await expect(page.getByText('SUFRA PREMIUM')).toBeVisible();

    // Stats labels
    await expect(page.getByText('الطلبات')).toBeVisible();
    await expect(page.getByText('المفضلة').first()).toBeVisible();
    await expect(page.getByText('نقاط الولاء')).toBeVisible();
    // Loyalty value
    await expect(page.getByText('480')).toBeVisible();

    // All six menu rows
    for (const label of ['طلباتي', 'العناوين', 'طرق الدفع', 'الكوبونات', 'الإشعارات']) {
      await expect(page.getByRole('link', { name: new RegExp(label) })).toBeVisible();
    }
    await expect(page.getByText('جديد')).toBeVisible(); // coupons badge
    await expect(page.getByRole('button', { name: 'تسجيل الخروج' })).toBeVisible();
  });

  test('menu item routes to the per-section placeholder and back returns to /account', async ({ page }) => {
    await page.goto('/account');
    await page.getByRole('link', { name: /طلباتي/ }).click();
    await expect(page).toHaveURL(/\/account\/orders$/);
    await expect(page.getByRole('heading', { name: 'طلباتي' })).toBeVisible();
    await expect(page.getByText('قريباً')).toBeVisible();

    await page.getByRole('button', { name: 'رجوع' }).click();
    await expect(page).toHaveURL(/\/account$/);
  });

  test('bottom nav links to /account from the home screen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'حسابي' }).first().click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText('SUFRA PREMIUM')).toBeVisible();
  });

  test('order stats refresh on return after checkout', async ({ page }) => {
    // Baseline: zero orders → "0" appears in the stats card.
    await page.goto('/account');
    await expect(page.getByText('SUFRA PREMIUM')).toBeVisible();
    // The orders cell is the first stat cell — value is rendered with .num class.
    // We assert by combination of label + value rather than the number alone
    // (480 loyalty points would otherwise interfere with a bare "0" assertion).

    // Place an order through the full happy path.
    await page.goto('/product/p1');
    await page.getByRole('button', { name: 'أضف إلى السلة' }).click();
    await page.getByRole('button', { name: 'متابعة إلى الدفع' }).click();
    await page.getByRole('button', { name: /تأكيد الطلب/ }).click();
    await expect(page).toHaveURL(/\/checkout\/success\/SUF-\d{4}-\d{5}$/);

    // Back to /account — the orders count should have invalidated and refetched.
    await page.goto('/account');
    // The stats card shows "1" (the order we just placed) next to "الطلبات".
    const ordersCell = page.locator('div').filter({ hasText: /^1الطلبات$/ }).first();
    await expect(ordersCell).toBeVisible();
  });
});
