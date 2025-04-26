import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  // Only show navbar on schedule-related pages
  const schedulePaths = [
    '/schedule',
    '/schedule/availability',
    '/schedule/instructor',
    '/schedule/coach',
    '/schedule/manager',
    '/schedule/manager-dashboard',
    '/schedule/progress'
  ];

  // Hide navbar on auth pages
  const authPaths = ['/login', '/register', '/forgot-password'];

  // Check if current path is an auth path
  const isAuthPath = authPaths.some(path => location.pathname === path);
  
  // Check if current path is a schedule path
  const isSchedulePath = schedulePaths.some(path => location.pathname.startsWith(path));
  
  // Only show navbar if it's a schedule path AND not an auth path
  const shouldShowNavbar = isSchedulePath && !isAuthPath;

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