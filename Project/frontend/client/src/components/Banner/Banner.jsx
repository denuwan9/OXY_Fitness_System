// components/Banner/Banner.jsx
import React from 'react';
import './Banner.css';
import sup2 from '../../assets/sup2.png';
import sup3 from '../../assets/sup3.png';

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-content">
        <h1>Get 40% Off to Vital Strength Supplements</h1>
        <button className="shop-now">Shop Now</button>
        <div className="terms">
          <a href="#">Limited Time Offer</a>
        </div>
      </div>
      <div className="banner-image">
        <img src={sup2} alt="Supplement" className="main-supplement" />
        <img src={sup3} alt="Supplement" className="second-supplement" />
      </div>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </section>
  );
};

export default Banner;