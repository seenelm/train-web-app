import { test, expect } from '@playwright/test';

test('basic app test', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:5173');

  // Check if the root element exists
  const rootElement = await page.locator('#root');
  await expect(rootElement).toBeVisible();
}); 