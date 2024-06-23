const createUser = async (request, username, name, password) => {
    // Create a user for the backend
    var newUser = await request.post('/api/users', {
        data: {
            username,
            name,
            password
        }
    });
};

const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click();
    await page.getByTestId('newBlogTitle').fill(title);
    await page.getByTestId('newBlogAuthor').fill(author);
    await page.getByTestId('newBlogUrl').fill(url);
    await page.getByRole('button', { name: 'create' }).click();
    await page.getByText(`${title} ${author}`).waitFor();
    //await page.getByText(title).waitFor();
};

export { createUser, loginWith, createBlog };
