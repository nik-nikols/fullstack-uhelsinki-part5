import { render } from "@testing-library/react";
import Blog from "./Blog";
import { expect } from "vitest";
import { userEvent } from "@testing-library/user-event";

test('<Blog /> shows title and author and hides url and likes by default', () => {
    const testBlog = {
        title: 'Blog title is visible',
        author: 'Author is visible',
        url: 'URL not visible',
        likes: 1,
        user: { username: 'testuser' }
    };

    const testUser = { username: 'testuser' };

    const { container } = render(<Blog blog={testBlog} user={testUser} />);

    const blogDiv = container.querySelector('.blogDiv');
    const blogDetailsDiv = container.querySelector('.blogDetailsDiv');

    expect(blogDiv).toBeVisible();
    expect(blogDetailsDiv).toHaveStyle('display: none');
});

test('<Blog /> shows details when button is clicked', async () => {
    const testBlog = {
        title: 'Blog title is visible',
        author: 'Author is visible',
        url: 'URL not visible',
        likes: 1,
        user: { username: 'testuser' }
    };

    const testUser = { username: 'testuser' };

    const user = userEvent.setup();

    const { container } = render(<Blog blog={testBlog} user={testUser} />);
    const button = container.querySelector('.buttonDetails');

    await user.click(button);

    const blogDiv = container.querySelector('.blogDiv');
    const blogDetailsDiv = container.querySelector('.blogDetailsDiv');

    expect(blogDiv).toBeVisible();
    expect(blogDetailsDiv).toBeVisible();
});

test('if the like button is clicked twice, the event handler is called twice', async () => {
    const testBlog = {
        title: 'Blog title is visible',
        author: 'Author is visible',
        url: 'URL not visible',
        likes: 1,
        user: { username: 'testuser' }
    };

    const testUser = { username: 'testuser' };
    const user = userEvent.setup();
    const addLike = vi.fn();

    const { container } = render(<Blog blog={testBlog} user={testUser} addLike={addLike}/>);
    const button = container.querySelector('.buttonDetails');
    const buttonLike = container.querySelector('.buttonLike');

    await user.click(button);
    await user.click(buttonLike);
    await user.click(buttonLike);

    expect(addLike.mock.calls).toHaveLength(2);
});
