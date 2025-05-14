// components/SupplementNav/SupplementNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SupplementNav.css';

const SupplementNav = () => {
  const location = useLocation();
  
  return (
    <section className="supplement-nav">
      <Link to="/" className={`supplement-tab ${location.pathname === '/' ? 'active' : ''}`}>
        SUPER DEALS<br /><span>UP TO 40% OFF</span>
      </Link>
      <Link to="/vitamins" className={`supplement-tab ${location.pathname === '/vitamins' ? 'active' : ''}`}>
        VITAMINS
      </Link>
      <Link to="/proteins" className={`supplement-tab ${location.pathname === '/proteins' ? 'active' : ''}`}>
        PROTEINS
      </Link>
      <Link to="/boosters" className={`supplement-tab ${location.pathname === '/boosters' ? 'active' : ''}`}>
        BOOSTERS
      </Link>
    </section>
  );
};

export default SupplementNav;