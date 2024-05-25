import { render, screen } from "@testing-library/react";
import NewBlog from "./NewBlog";
import { expect } from "vitest";
import { userEvent } from "@testing-library/user-event";

test('form calls the event handler', async () => {
    const createBlogHandler = vi.fn();
    const user = userEvent.setup();
    render(<NewBlog createBlog={createBlogHandler} />);

    const button = screen.getByText('create');

    await user.click(button);

    expect(createBlogHandler.mock.calls).toHaveLength(1);
});