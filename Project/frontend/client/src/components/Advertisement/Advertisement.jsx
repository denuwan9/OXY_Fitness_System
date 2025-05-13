import React from 'react';
import './Advertisement.css';

const Advertisement = () => {
  return (
    <div className="advertisement-container">
      <div className="ad-content">
        <div className="ad-text">
          <h2 className="ad-title">FIRST PURCHASE SPECIAL!</h2>
          <p className="ad-description">
            Get an <span className="highlight">EXTRA 15% OFF</span> your first order when you pay with
          </p>
          <div className="payment-methods">
            <div className="payment-icon mastercard"></div>
            <div className="payment-icon visa"></div>
          </div>
          <p className="ad-terms">Use code <span className="promo-code">FIRST15</span> at checkout</p>
        </div>
        <div className="ad-image-container">
          <div className="discount-bubble">+15% OFF</div>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;