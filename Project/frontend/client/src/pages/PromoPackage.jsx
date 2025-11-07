import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PromoPackage.css';

const promoPackages = [
  {
    id: 1,
    title: 'New Year Fitness Blast',
    description: '50% off on 3-month packages',
    validUntil: 'January 31st, 2024',
    type: 'green',
    icon: '⚡',
    discount: 0.5,
    appliesTo: ['Gold', 'Platinum']
  },
  {
    id: 2,
    title: 'Family Fitness Package',
    description: 'Group discount for families',
    validUntil: 'Limited time offer',
    type: 'red',
    icon: '👨‍👩‍👧‍👦',
    discount: 0.3,
    appliesTo: ['Silver', 'Gold', 'Platinum']
  },
  {
    id: 3,
    title: 'Summer Body Challenge',
    description: 'Free personal training sessions',
    validUntil: 'June 30th, 2024',
    type: 'blue',
    icon: '☀️',
    discount: 0.2,
    appliesTo: ['Platinum']
  },
  {
    id: 4,
    title: 'Student Special',
    description: '40% discount for students',
    validUntil: 'September 30th, 2024',
    type: 'purple',
    icon: '🎓',
    discount: 0.4,
    appliesTo: ['Silver', 'Gold']
  }
];

function PromoPackage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPromoPackages = promoPackages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.appliesTo.some(type => 
      type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleClaimOffer = (pkg) => {
    const selectedPackage = pkg.appliesTo.includes('Gold') ? 'Gold' : pkg.appliesTo[0];
    const basePrice = {
      'Silver': 29.99,
      'Gold': 49.99,
      'Platinum': 79.99
    }[selectedPackage];
    const discountedPrice = basePrice * (1 - pkg.discount);

    navigate(`/form/${selectedPackage.toLowerCase()}`, {
      state: {
        isPromo: true,
        promoData: pkg,
        selectedPackage,
        selectedPrice: `$${discountedPrice.toFixed(2)}`
      }
    });
  };

  return (
    <div className="promo-packages-container">
      <div className="promo-header">
        <h1 className="promo-packages-title">Seasonal Promo Packages</h1>
        <p className="promo-packages-subtitle">Limited time offers to boost your fitness journey</p>
        
        <div className="promo-search-container">
          <input
            type="text"
            placeholder="Search promo packages..."
            className="promo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="promo-packages-grid">
        {filteredPromoPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`promo-package-card promo-package-${pkg.type}`}
          >
            <div className="promo-package-icon">{pkg.icon}</div>
            
            <div className="promo-package-content">
              <h3 className="promo-package-title">{pkg.title}</h3>
              <p className="promo-package-description">{pkg.description}</p>
              
              <div className="promo-package-details">
                <span className="promo-package-date">
                  Valid until: {pkg.validUntil}
                </span>
                <button 
                  className="promo-package-button"
                  onClick={() => handleClaimOffer(pkg)}
                >
                  Claim Offer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/membership')}
        className="back-to-packages-button"
      >
        ← Back to Membership Packages
      </button>
    </div>
  );
}

export default PromoPackage;