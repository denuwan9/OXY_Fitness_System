import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VitaminCards.css';
import v1 from '../../assets/v1 (1).png';
import v2 from '../../assets/v2.png';
import v3 from '../../assets/v3.png';
import v4 from '../../assets/v4.png';
import v5 from '../../assets/v5.png';
import v6 from '../../assets/v6.png';
import v7 from '../../assets/v7.png';
import v8 from '../../assets/v8.png';

const VitaminCards = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const vitamins = [
    {
      id: 1,
      name: "Vitamin C Complex",
      image: v1,
      price: 2999.99,
      oldPrice: 3999.99,
      category: "immunity",
      description: "Boost your immune system with our premium Vitamin C supplement",
      benefits: ["Immune Support", "Antioxidant", "Collagen Production"],
      brand: "Health Plus",
      serving: "1000mg per serving",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Vitamin D3 + K2",
      image: v2,
      price: 3499.99,
      oldPrice: 4499.99,
      category: "bone",
      description: "Essential for bone health and immune function",
      benefits: ["Bone Health", "Immune Support", "Heart Health"],
      brand: "Nature's Best",
      serving: "5000IU per serving",
      rating: 4.7,
      reviews: 98
    },
    {
      id: 3,
      name: "B-Complex Plus",
      image: v3,
      price: 2799.99,
      oldPrice: 3599.99,
      category: "energy",
      description: "Complete B-vitamin complex for energy and metabolism",
      benefits: ["Energy Boost", "Metabolism", "Brain Function"],
      brand: "Vitality",
      serving: "Complex B vitamins",
      rating: 4.6,
      reviews: 156
    },
    {
      id: 4,
      name: "Omega-3 Fish Oil",
      image: v4,
      price: 3999.99,
      oldPrice: 4999.99,
      category: "heart",
      description: "Pure and potent omega-3 fatty acids for heart health",
      benefits: ["Heart Health", "Brain Function", "Joint Support"],
      brand: "Pure Health",
      serving: "1000mg per serving",
      rating: 4.9,
      reviews: 112
    },
    {
      id: 5,
      name: "Magnesium Glycinate",
      image: v5,
      price: 2499.99,
      oldPrice: 3299.99,
      category: "mineral",
      description: "High-absorption magnesium for muscle and nerve function",
      benefits: ["Muscle Function", "Sleep Support", "Stress Relief"],
      brand: "Nature's Best",
      serving: "400mg per serving",
      rating: 4.5,
      reviews: 89
    },
    {
      id: 6,
      name: "Zinc & Selenium",
      image: v6,
      price: 2299.99,
      oldPrice: 2999.99,
      category: "immunity",
      description: "Essential minerals for immune system support",
      benefits: ["Immune Support", "Antioxidant", "Skin Health"],
      brand: "Health Plus",
      serving: "15mg Zinc, 100mcg Selenium",
      rating: 4.7,
      reviews: 76
    },
    {
      id: 7,
      name: "CoQ10 with Vitamin E",
      image: v7,
      price: 4599.99,
      oldPrice: 5599.99,
      category: "heart",
      description: "Powerful antioxidant for heart health and energy",
      benefits: ["Heart Health", "Energy", "Antioxidant"],
      brand: "Pure Health",
      serving: "100mg CoQ10, 400IU Vitamin E",
      rating: 4.8,
      reviews: 103
    },
    {
      id: 8,
      name: "Multivitamin Plus",
      image: v8,
      price: 4999.99,
      oldPrice: 5999.99,
      category: "multivitamin",
      description: "Complete daily multivitamin for overall wellness",
      benefits: ["Daily Support", "Energy", "Wellness"],
      brand: "Vitality",
      serving: "Complete multivitamin formula",
      rating: 4.6,
      reviews: 92
    }
  ];

  const filteredVitamins = selectedCategory === 'all' 
    ? vitamins 
    : vitamins.filter(vitamin => vitamin.category === selectedCategory);

  const handleBuyNow = (vitamin) => {
    navigate('/checkout', {
      state: {
        product: {
          ...vitamin,
          newPrice: formatPrice(vitamin.price),
          oldPrice: formatPrice(vitamin.oldPrice),
          quantity: 1
        }
      }
    });
  };

  const handleViewDetails = (vitamin) => {
    navigate(`/product-detail/${vitamin.id}`, {
      state: {
        product: {
          ...vitamin,
          newPrice: formatPrice(vitamin.price),
          oldPrice: formatPrice(vitamin.oldPrice)
        }
      }
    });
  };

  return (
    <div className="vitamin-cards-container">
      <div className="category-filter">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''} 
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button 
          className={selectedCategory === 'immunity' ? 'active' : ''} 
          onClick={() => setSelectedCategory('immunity')}
        >
          Immunity
        </button>
        <button 
          className={selectedCategory === 'energy' ? 'active' : ''} 
          onClick={() => setSelectedCategory('energy')}
        >
          Energy
        </button>
        <button 
          className={selectedCategory === 'heart' ? 'active' : ''} 
          onClick={() => setSelectedCategory('heart')}
        >
          Heart Health
        </button>
      </div>

      <div className="vitamin-grid">
        {filteredVitamins.map((vitamin) => (
          <div key={vitamin.id} className="vitamin-card">
            <div className="card-image" onClick={() => handleViewDetails(vitamin)}>
              <img src={vitamin.image} alt={vitamin.name} />
              {vitamin.oldPrice && (
                <span className="discount-badge">
                  {Math.round(((vitamin.oldPrice - vitamin.price) / vitamin.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <div className="card-content">
              <h3 className="vitamin-name" onClick={() => handleViewDetails(vitamin)}>{vitamin.name}</h3>
              <p className="vitamin-description">{vitamin.description}</p>
              <div className="benefits-list">
                {vitamin.benefits.map((benefit, index) => (
                  <span key={index} className="benefit-tag">{benefit}</span>
                ))}
              </div>
              <div className="price-section">
                <span className="current-price">{formatPrice(vitamin.price)}</span>
                {vitamin.oldPrice && (
                  <span className="old-price">{formatPrice(vitamin.oldPrice)}</span>
                )}
              </div>
              <button className="add-to-cart-btn" onClick={() => handleBuyNow(vitamin)}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitaminCards; 