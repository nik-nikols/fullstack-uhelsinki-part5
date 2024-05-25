import { useState } from 'react'
import PropTypes from 'prop-types';

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
    <div style={blogStyle} className='blogDiv'>
      {blog.title} {blog.author} <button onClick={toggleVisibility} className='buttonDetails'>{labelDetails}</button>
      <div style={showWhenVisible} className='blogDetailsDiv'>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button className='buttonLike' onClick={addLike}>like</button></div>
        <div>{blog.user ? blog.user.name : null}</div>
        {deleteButton()}
      </div>
    </div>  
  );
};

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
};

export default Blog