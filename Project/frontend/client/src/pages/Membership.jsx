import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Membership.css';

const Membership = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPromoSearch, setShowPromoSearch] = useState(false);

  const packages = [
    {
      name: 'Silver',
      price: '$29.99',
      description: 'Essential gym access with basic features',
      features: [
        'Standard training time slots',
        'Basic supplement allowance',
        '1-month validity',
        'Limited class access'
      ],
      color: 'silver-package',
      icon: '🏋️'
    },
    {
      name: 'Gold',
      price: '$49.99',
      description: 'Enhanced fitness experience',
      features: [
        'Extended training hours',
        'Increased supplement allowance',
        '3-month validity',
        'Advanced class selection',
        'Personal trainer consultation'
      ],
      color: 'gold-package',
      icon: '💪'
    },
    {
      name: 'Platinum',
      price: '$79.99',
      description: 'Premium fitness journey',
      features: [
        '24/7 gym access',
        'Comprehensive supplement package',
        '6-month validity',
        'Unlimited class access',
        'Personal trainer sessions',
        'Nutrition consultation'
      ],
      color: 'platinum-package',
      icon: '🌟',
      recommended: true
    }
  ];

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.features.some(feature => 
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="membership-page">
      
      
      <main className="membership-container">
        <section className="hero-section">
        
        
          
        <div className="header-animation">
        <h1 className="package-title">Oxy Fitness Membership Packages</h1>
              <p className="package-subtitle">Transform your fitness journey with our premium packages</p>
              
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search packages..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="search-promo-button"
                  onClick={() => setShowPromoSearch(!showPromoSearch)}
                >
                  {showPromoSearch ? 'Hide Promo Search' : 'Search Promo Packages'}
                </button>
              </div>
              </div>
              
              
              
        </section>

        <section className="packages-section">
        <div className="package-grid">
              {filteredPackages.map((pkg, index) => (
                <div 
                  key={pkg.name} 
                  className={`package-card ${pkg.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {pkg.recommended && (
                    <div className="package-card-recommended">
                      <span className="recommended-badge">🔥 Recommended</span>
                    </div>
                  )}
                  <div className="package-header">
                    <span className="package-emoji">{pkg.icon}</span>
                    <h2 className="package-name">{pkg.name} Package</h2>
                  </div>
                  <p className="package-price">{pkg.price}<span className="month-text">/month</span></p>
                  <p className="package-description">{pkg.description}</p>
                  <div className="features-container">
                    <ul className="package-features">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="package-feature">
                          <svg 
                            className="package-feature-icon" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    className="package-button"
                    onClick={() => navigate(`/form/${pkg.name.toLowerCase()}`)}
                  >
                    Choose {pkg.name} Package
                    <span className="button-arrow">→</span>
                  </button>
                </div>
              ))}
            </div>
        </section>

        <section className="promo-section">
        <div className="promo-content">
                <h3 className="promo-title">Limited Time Offers!</h3>
                <p className="promo-text">Discover our seasonal promotions and save up to 50%</p>
                <button 
                  onClick={() => navigate('/promo')}
                  className="promo-button"
                >
                  View Seasonal Promo Packages
                  <span className="button-sparkle">✨</span>
                </button>
              </div>
        </section>

        <section className="flexible-management">
        <div className="management-content">
                <h3 className="flexible-management-title">
                  <span className="highlight">Flexible</span> Package Management
                </h3>
                <p className="flexible-management-description">
                  Our packages are dynamically managed to ensure you always get the best value. 
                  Prices and features can be updated to reflect current market conditions and 
                  member needs. The Membership Manager can modify package details in real-time, 
                  providing you with the most up-to-date fitness solutions.
                </p>
                <div className="management-icons">
                  <span className="management-icon">🔄</span>
                  <span className="management-icon">⚡</span>
                  <span className="management-icon">📊</span>
                </div>
              </div>
        </section>
      </main>
      
      
    </div>
  );
};

export default Membership;