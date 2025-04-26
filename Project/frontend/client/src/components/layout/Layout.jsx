import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  // Only show navbar on specific schedule-related pages
  const schedulePaths = [
    '/schedule/availability',
    '/schedule/instructor',
    '/schedule/coach',
    '/schedule/progress'
  ];

  // Hide navbar on auth pages and manager pages
  const authPaths = ['/login', '/register', '/forgot-password'];
  const managerPaths = ['/schedule/manager', '/schedule/manager-dashboard'];

  // Check if current path is an auth path or manager path
  const isAuthPath = authPaths.some(path => location.pathname === path);
  const isManagerPath = managerPaths.some(path => location.pathname.startsWith(path));
  
  // Check if current path is a schedule path
  const isSchedulePath = schedulePaths.some(path => location.pathname.startsWith(path));
  
  // Only show navbar if it's a schedule path AND not an auth path AND not a manager path
  const shouldShowNavbar = isSchedulePath && !isAuthPath && !isManagerPath;

  return (
    <div className="layout">
      <Header />
      {shouldShowNavbar && <Navbar />}
      <main className={`main-content ${shouldShowNavbar ? 'with-navbar' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 