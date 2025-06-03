import { test, expect } from '@playwright/test';

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
  });

  test('should display forgot password form', async ({ page }) => {
    // Verify the page title is displayed
    await expect(page.locator('h1')).toContainText('Forgot Password');
    
    // Check form elements using data-testid attributes
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
    
    // Verify the form description is displayed
    await expect(page.locator('.form-description')).toContainText('Enter your email address');
  });

  test('should require email to be entered', async ({ page }) => {
    // Try to submit the form without entering an email
    await page.click('[data-testid="submit-button"]');
    
    // Check that the form validation prevents submission
    // HTML5 validation will show a browser validation message
    // We can check if we're still on the same page
    await expect(page).toHaveURL(/.*\/forgot-password/);
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill in the form with a valid email
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    
    // Start watching for loading state before clicking
    const submitButtonPromise = page.waitForSelector('[data-testid="submit-button"] .loading-spinner');
    
    // Submit the form
    await page.click('[data-testid="submit-button"]');
    
    // Verify loading state appears
    await submitButtonPromise;
  });

  test('should navigate to reset password page after submission', async ({ page }) => {
    // Fill in the form with a valid email
    const testEmail = 'test@example.com';
    await page.fill('[data-testid="email-input"]', testEmail);
    
    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="submit-button"]')
    ]);
    
    // Verify we've been redirected to the reset password page with the email in the URL
    await expect(page).toHaveURL(/.*\/reset-password\?email=test%40example\.com/);
  });
});
