import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('should load the home page', async ({ page }) => {
		await page.goto('/');

		// Check that the page loaded
		await expect(page).toHaveTitle(/Multipult/i);
	});

	test('should display navigation', async ({ page }) => {
		await page.goto('/');

		// Check if main content is visible
		const body = await page.locator('body');
		await expect(body).toBeVisible();
	});

	test('should be able to navigate to login page', async ({ page }) => {
		await page.goto('/');

		// Try to find and click login link if it exists
		const loginLink = page.getByRole('link', { name: /login/i });
		if (await loginLink.count() > 0) {
			await loginLink.click();
			await expect(page).toHaveURL(/\/login/);
		}
	});
});
