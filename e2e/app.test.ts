import { test, expect } from '@playwright/test';

test('basic app test', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if the root element exists (using #root which is standard for React apps)
  const rootElement = await page.locator('#root');
  await expect(rootElement).toBeVisible();
});