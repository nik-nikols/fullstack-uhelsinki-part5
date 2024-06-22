const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith } = require('./helper');

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
            await loginWith(page, 'testuser', 'Test New User Password');

            await expect(page.getByText('Test User logged in')).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'NOTtestuser', 'NOT Password');

            await expect(page.getByText('Wrong username or password')).toBeVisible();
            await expect(page.getByText('NOTtestuser logged in')).not.toBeVisible();
        });

        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, 'testuser', 'Test New User Password');
            });
          
            test('a new blog can be created', async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click();

                await page.getByTestId('newBlogTitle').fill('New Blog Title');
                await page.getByTestId('newBlogAuthor').fill('New Blog Author');
                await page.getByTestId('newBlogUrl').fill('http://newblogurl.org');
                await page.getByRole('button', { name: 'create' }).click();

                await expect(page.getByRole('button', { name: 'create' })).not.toBeVisible();
                await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible();
                await expect(page.getByText('New Blog Title New Blog Author')).toBeVisible();
            });
        });
    });
});