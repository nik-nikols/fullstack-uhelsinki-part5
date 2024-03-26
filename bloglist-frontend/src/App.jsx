import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const userKey = 'loggedinUser'

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJson = window.localStorage.getItem(userKey)
    if (userJson) {
      const user = JSON.parse(userJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const newBlogRef = useRef()

  const showMessage = (newMessage, newMessageType = 'success') => {
    setMessageType(newMessageType)
    setMessage(newMessage)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(userKey, JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.error(exception);
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(userKey)
    setUser(null)
    blogService.setToken(null)
  }
  
  const addBlog = (newBlog) => {
    newBlogRef.current.toggleVisibility();

    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showMessage(`a new blog '${returnedBlog.title}' added`)
      })
  }

  const loginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <div>
            <button type='submit'>login</button>
          </div>
        </form>
      </div>
    )
  }

  const newBlogForm = () => {
    return (
      <Togglable buttonLabel='new blog' ref={newBlogRef}>
        <NewBlog createBlog={addBlog} />
      </Togglable>
    )
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType={messageType} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType} />
      <p>{`${user.name} logged in`} <button onClick={handleLogout}>logout</button></p>
      {newBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App