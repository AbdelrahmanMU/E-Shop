import { expect, test } from '@playwright/test';

test.describe('F5 admin overview', () => {
  test('renders the full shell + 6 panels', async ({ page }) => {
    await page.goto('/admin');

    // Sidebar identity
    await expect(page.getByText('ADMIN', { exact: true })).toBeVisible();
    await expect(page.getByText('كريم منصور')).toBeVisible();
    // Three sidebar sections
    await expect(page.getByText('إدارة', { exact: true })).toBeVisible();
    await expect(page.getByText('التسويق', { exact: true })).toBeVisible();
    await expect(page.getByText('النظام', { exact: true })).toBeVisible();

    // Topbar
    await expect(page.getByRole('heading', { name: 'نظرة عامة' })).toBeVisible();
    await expect(page.getByPlaceholder('بحث في كل شيء…')).toBeVisible();
    await expect(page.getByRole('button', { name: /إضافة سريعة/ })).toBeVisible();

    // KPIs
    for (const label of ['مبيعات اليوم', 'طلبات جديدة', 'متوسط قيمة الطلب', 'عملاء جدد']) {
      await expect(page.getByText(label)).toBeVisible();
    }

    // Panels
    for (const label of [
      'المبيعات الأسبوعية',
      'آخر الطلبات',
      'الأكثر مبيعاً',
      'أوقات الذروة',
      'حسب المدينة',
    ]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
  });

  test('sidebar navigates to a placeholder section + active state highlights', async ({ page }) => {
    await page.goto('/admin');

    // Overview is the active item at /admin
    await expect(page.getByRole('link', { name: /نظرة عامة/ })).toHaveAttribute('aria-current', 'page');

    await page.getByRole('link', { name: /العملاء/ }).click();
    await expect(page).toHaveURL(/\/admin\/customers$/);
    await expect(page.getByRole('heading', { name: 'العملاء' })).toBeVisible();
    await expect(page.getByText('قريباً').first()).toBeVisible();

    // The active state on the sidebar must flip — this is what drives the
    // gold accent bar visual and the gold text color in the design.
    await expect(page.getByRole('link', { name: /العملاء/ })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('link', { name: /نظرة عامة/ })).not.toHaveAttribute('aria-current', 'page');

    await page.getByRole('link', { name: /عودة للنظرة العامة/ }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });
});
