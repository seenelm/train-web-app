import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Navigation', () => {
  test('should redirect from root to privacy policy', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveURL(`${BASE_URL}/privacy`);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });
}); 