import { useState } from 'react';
import PropTypes from 'prop-types';

const NewBlog = ({ createBlog }) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogUrl, setNewBlogUrl] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()
        
        const newBlog = {
          title: newBlogTitle,
          author: newBlogAuthor,
          url: newBlogUrl
        }

        createBlog(newBlog);
    
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
      }
    
    
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title: <input type='text' data-testid='newBlogTitle' value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} />
                </div>
                <div>
                    author: <input type='text' data-testid='newBlogAuthor' value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} />
                </div>
                <div>
                    url: <input type='text' data-testid='newBlogUrl' value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    );
};

NewBlog.propTypes = {
    createBlog: PropTypes.func.isRequired
};

export default NewBlog;