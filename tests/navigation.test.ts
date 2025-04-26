import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should redirect from root to privacy policy', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveURL('http://localhost:5173/privacy');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await expect(page).toHaveURL('http://localhost:5173/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });
}); 