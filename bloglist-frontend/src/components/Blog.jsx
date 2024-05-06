import { useState } from 'react'

const Blog = ({ user, blog, addLike, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visibleDetails, setVisibleDetails] = useState(false);
  const [labelDetails, setLabelDetails] = useState('view');

  const showWhenVisible = { display: visibleDetails ? '' : 'none'};

  const toggleVisibility = () => {
    setLabelDetails(visibleDetails ? 'view' : 'hide')
    setVisibleDetails(!visibleDetails);
  };

  const deleteButton = () => {
    if (blog.user.username === user.username) {
      return (
        <div>
          <button onClick={deleteBlog}>delete</button>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{labelDetails}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={addLike}>like</button></div>
        <div>{blog.user ? blog.user.name : null}</div>
        {deleteButton()}
      </div>
    </div>  
  );
  };

export default Blog