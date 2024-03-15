import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
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
    }
  }, [])

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
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.error(exception);
      showMessage('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(userKey)
    setUser(null)
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
      <p>{`${user.name} logged in`} <button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App