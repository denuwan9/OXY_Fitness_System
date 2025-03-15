import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './login.jsx'
import Profile from './Profile.jsx'
import Signup from './Signup.jsx'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
