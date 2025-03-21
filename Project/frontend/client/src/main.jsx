import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './pages/login.jsx'
import Profile from './pages/Profile.jsx'
import Signup from './pages/Signup.jsx'
import UserManager from './pages/UserManager.jsx'
import Home from './pages/Home.jsx'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
