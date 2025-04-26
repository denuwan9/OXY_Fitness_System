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

  const shouldShowNavbar = schedulePaths.some(path => location.pathname.startsWith(path));

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