import { useState } from 'react'
import Togglable from './Togglable'

const Blog = ({ blog }) => {
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

console.log('Blog: ', blog);

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{labelDetails}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button>like</button></div>
        <div>{blog.user ? blog.user.name : null}</div>
      </div>
    </div>  
  );
  };

export default Blog