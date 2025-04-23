import { test, expect } from '@playwright/test';

test('homepage has title and loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check title
  await expect(page).toHaveTitle(/Train Web App/);
  
  // This is a placeholder test - update based on your actual homepage content
  // For example, if your homepage has a specific heading:
  // await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
