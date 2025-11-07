// components/SupplementNav/SupplementNav.jsx
import React from 'react';
import './SupplementNav.css';

const SupplementNav = () => {
  return (
    <section className="supplement-nav">
      <div className="supplement-tab active">SUPER DEALS<br /><span>UP TO 40% OFF</span></div>
      <div className="supplement-tab">VITAMINS</div>
      <div className="supplement-tab">PROTEINS</div>
      <div className="supplement-tab">BOOSTERS</div>
    </section>
  );
};

export default SupplementNav;