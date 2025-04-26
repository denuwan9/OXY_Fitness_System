import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Don't show header on login page
  if (location.pathname === '/login') return null;

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    if (user) {
      // Clear any stored user data/tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      navigate('/login');
    }
  };

  return (
    <header className="main-header">
      <Link to="/" className="logo">OXY FITNESS</Link>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/coaches">Coaches</Link></li>
          <li><Link to="/programs">Programs</Link></li>
          <li><Link to="/memberships">Memberships</Link></li>
          <li><Link to="/contacts">Contacts</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </nav>
      <div className="user-profile">
        {user ? (
          <>
            <img src="/images/bell.png" alt="Bell Icon" className="bell-icon" /> 
            <img
              src="/images/profileimg.png" 
              alt="Profile"
              className="profile-img"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header; 