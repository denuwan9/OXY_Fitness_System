import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          {user.role === 'member' && (
            <Link 
              to="/schedule" 
              className={`navbar-link ${isActive('/schedule') ? 'active' : ''}`}
            >
              <span className="link-icon">📅</span>
              <span className="link-text">My Schedule</span>
            </Link>
          )}
          
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
          
          {user.role === 'operation_manager' && (
            <Link 
              to="/schedule/manager" 
              className={`navbar-link ${isActive('/schedule/manager') ? 'active' : ''}`}
            >
              <span className="link-icon">📋</span>
              <span className="link-text">Schedule Requests</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 