import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Only show navbar on specific pages
  const allowedPaths = ['/schedule/instructor', '/schedule/availability', '/schedule/coach'];
  if (!user || !allowedPaths.includes(location.pathname)) return null;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          {(user.role === 'instructor' || user.role === 'coach') && (
            <>
              <Link 
                to="/schedule/availability" 
                className={`navbar-link ${isActive('/schedule/availability') ? 'active' : ''}`}
              >
                <span className="link-icon">⏰</span>
                <span className="link-text">Manage Availability</span>
              </Link>
              <Link 
                to="/schedule/instructor" 
                className={`navbar-link ${isActive('/schedule/instructor') ? 'active' : ''}`}
              >
                <span className="link-icon">👥</span>
                <span className="link-text">Manage Member Schedules</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 