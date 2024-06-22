const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // Empty the DB
        await request.post('/api/testing/reset');

        // Create a user for the backend
        var newUser = await request.post('/api/users', {
            data: {
                username: 'testuser',
                name: 'Test User',
                password: 'Test New User Password'
            }
        });

        await page.goto('/');
    });

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('log in to application')).toBeVisible();
    });

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('testuser');
            await page.getByTestId('password').fill('Test New User Password');

            await page.getByRole('button', { name: 'login' }).click();

            await expect(page.getByText('Test User logged in')).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('NOTtestuser');
            await page.getByTestId('password').fill('NOT Password');

            await page.getByRole('button', { name: 'login' }).click();

            await expect(page.getByText('Wrong username or password')).toBeVisible();
            await expect(page.getByText('NOTtestuser logged in')).not.toBeVisible();
        });
    });
});