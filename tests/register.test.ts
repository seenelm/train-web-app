import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
  });

  test('should display registration form', async ({ page }) => {
    // Verify the page title is displayed
    await expect(page.locator('h1')).toContainText('Create Account');
    
    // Check form elements using data-testid attributes
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="terms-checkbox"]')).toBeVisible();
    await expect(page.locator('[data-testid="register-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="google-button"]')).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    // Fill in the registration form with mismatched passwords
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password456');
    await page.check('[data-testid="terms-checkbox"]');
    
    // Submit the form
    await page.click('[data-testid="register-button"]');
    
    // Check for password mismatch error
    await expect(page.locator('.password-error')).toBeVisible();
    await expect(page.locator('.password-error')).toContainText('Passwords do not match');
  });

  test('should show terms acceptance error', async ({ page }) => {
    // Fill in the registration form without accepting terms
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');
    // Do not check the terms checkbox
    
    // Submit the form
    await page.click('[data-testid="register-button"]');
    
    // Check for terms acceptance error
    await expect(page.locator('.terms-error')).toBeVisible();
    await expect(page.locator('.terms-error')).toContainText('You must accept the terms');
  });

  test('should show loading state during registration', async ({ page }) => {
    // Fill in the registration form correctly
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');
    await page.check('[data-testid="terms-checkbox"]');
    
    // Start watching for loading state before clicking
    const registerButtonPromise = page.waitForSelector('[data-testid="register-button"] .loading-spinner');
    
    // Submit the form
    await page.click('[data-testid="register-button"]');
    
    // Verify loading state appears
    await registerButtonPromise;
  });
});
