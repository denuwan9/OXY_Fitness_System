import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Show navbar for all authenticated users
  if (!user) return null;

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    const items = [];

    if (user.role === 'instructor' || user.role === 'coach') {
      items.push(
        {
          path: '/schedule/availability',
          icon: '⏰',
          text: 'Manage Availability'
        },
        {
          path: '/schedule/instructor',
          icon: '👥',
          text: 'Manage Member Schedules'
        }
      );
    } else if (user.role === 'member') {
      items.push(
        {
          path: '/schedule',
          icon: '📅',
          text: 'My Schedule'
        },
        {
          path: '/schedule/progress',
          icon: '📊',
          text: 'My Progress'
        }
      );
    } else if (user.role === 'manager') {
      items.push(
        {
          path: '/schedule/manager-dashboard',
          icon: '📊',
          text: 'Dashboard'
        },
        {
          path: '/schedule/manager',
          icon: '👥',
          text: 'Manage Schedules'
        }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 