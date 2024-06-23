const { test, describe, expect, beforeEach } = require('@playwright/test');
const { createUser, loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // Empty the DB
        await request.post('/api/testing/reset');

        // Create a user for the backend
        await createUser(request, 'testuser', 'Test User', 'Test New User Password');

        await page.goto('/');
    });

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('log in to application')).toBeVisible();
    });

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'testuser', 'Test New User Password');
            await page.getByText('Test User logged in').waitFor();

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
                await createBlog(page, 'New Blog Title', 'New Blog Author', 'http://newblogurl.org');

                await expect(page.getByRole('button', { name: 'create' })).not.toBeVisible();
                await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible();
                await expect(page.getByText('New Blog Title New Blog Author')).toBeVisible();
            });

            describe('When blog exists', () => {
                beforeEach(async ({ page }) => {
                    await createBlog(page, 'New Blog Title', 'New Blog Author', 'http://newblogurl.org');
                });

                test('blog can be liked', async ({ page }) => {
                    const element = await page.getByText('New Blog Title New Blog Author');
                    await element.getByRole('button', { name: 'view' }).click();
                    await element.getByRole('button', { name: 'like' }).click();

                    await expect(element.getByText('likes 1')).toBeVisible();
                });

                test ('user who created a blog can delete it', async ({ page }) => {
                    const element = await page.getByText('New Blog Title New Blog Author');
                    await element.getByRole('button', { name: 'view' }).click();
                    page.on('dialog', dialog => dialog.accept());
                    await element.getByRole('button', { name: 'delete' }).click();

                    await expect(element.getByText('New Blog Title', 'New Blog Author')).not.toBeVisible();

                });

                test ('only the user who added the blog sees the blog\'s delete button', async ({ page, request }) => {
                    const element = await page.getByText('New Blog Title New Blog Author');
                    await element.getByRole('button', { name: 'view' }).click();
                    await expect(element.getByRole('button', { name: 'delete' })).toBeVisible();

                    await page.getByRole('button', { name: 'logout' }).click();

                    // Create another user
                    await createUser(request, 'testuser2', 'Test User2', 'Test New User Password 2');
                    await loginWith(page, 'testuser2', 'Test New User Password 2');
                    const element2 = await page.getByText('New Blog Title New Blog Author');
                    await element2.getByRole('button', { name: 'view' }).click();
                    await expect(element2.getByRole('button', { name: 'delete' })).not.toBeVisible();
                });

                test('blogs are arranged in the order according to the likes', async ({ page }) => {
                    await createBlog(page, 'Other Blog Title', 'Other Blog Author', 'http://newblogurl.org/2');
                    const element = await page.getByText('New Blog Title New Blog Author');
                    await element.getByRole('button', { name: 'view' }).click();
                    await element.getByRole('button', { name: 'like' }).click();

                    let blogElements = await page.locator('.blogDiv').all();

                    await expect(blogElements[0].getByText('New Blog Title New Blog Author')).toBeVisible();

                    const element2 = await page.getByText('Other Blog Title Other Blog Author');
                    await element2.getByRole('button', { name: 'view' }).click();
                    await element2.getByRole('button', { name: 'like' }).click();
                    await element2.getByText('likes 1').waitFor();
                    await element2.getByRole('button', { name: 'like' }).click();
                    await element2.getByText('likes 2').waitFor();

                    blogElements = await page.locator('.blogDiv').all();

                    await expect(blogElements[0].getByText('Other Blog Title Other Blog Author')).toBeVisible();
                });
            });
        });
    });
});