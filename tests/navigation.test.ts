import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to privacy page', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');
    
    // Verify URL and page content
    await expect(page).toHaveURL(/.*\/privacy/);
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });
  
  test('should navigate to terms of service page', async ({ page }) => {
    await page.goto('/terms-of-service');
    await page.waitForLoadState('networkidle');
    
    // Verify URL and page content
    await expect(page).toHaveURL(/.*\/terms-of-service/);
    await expect(page.locator('h1')).toContainText('Terms of Service');
  });
  
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verify URL and page content
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
    
    // Verify login form elements are visible
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  });
  
  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    // Verify URL and page content
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.locator('h1')).toContainText('Create Account');
  });
  
  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    // Verify URL and page content
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.locator('h1')).toContainText('Forgot Password');
  });
});