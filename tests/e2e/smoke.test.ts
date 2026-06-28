import { test, expect } from '@playwright/test';

test.describe('College Memory Archive Smoke Tests', () => {

  test('homepage loads and shows critical sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/College Memory Archive/);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByText('Archive 2025')).toBeVisible();
  });

  test('admin login page is accessible', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'Management Console' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter management passcode')).toBeVisible();
  });

  test('public pages are accessible', async ({ page }) => {
    const pages = ['/people', '/gallery', '/timeline', '/messages'];
    for (const path of pages) {
      await page.goto(path);
      await expect(page).not.toHaveTitle(/404/);
    }
  });

  test('admin middleware redirects to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
