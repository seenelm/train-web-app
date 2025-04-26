import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Navigation', () => {
  test('should navigate to privacy page', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);
    await expect(page).toHaveURL(`${BASE_URL}/privacy`);
  });
  test('should navigate to terms of service page', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms-of-service`);
    await expect(page).toHaveURL(`${BASE_URL}/terms-of-service`);
  });
  test('should navigate to login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });
}); 