import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Boosters.css';
import pre1 from '../../assets/pre1.png';
import pre2 from '../../assets/pre2.png';
import pre3 from '../../assets/pre3.png';
import pre4 from '../../assets/pre4.png';
import pre5 from '../../assets/pre5.png';

const Boosters = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  const boosters = [
    {
      id: 1,
      name: "Pre-Workout Elite",
      image: pre1,
      price: 8999.99,
      oldPrice: 10999.99,
      category: "pre",
      rating: 4.8,
      reviews: 156,
      description: "Advanced pre-workout formula for maximum performance",
      benefits: ["Energy Boost", "Focus Enhancement", "Strength Support"],
      servings: 30,
      flavor: "Fruit Punch"
    },
    {
      id: 2,
      name: "BCAA Complex",
      image: pre2,
      price: 6999.99,
      oldPrice: 7999.99,
      category: "recovery",
      rating: 4.7,
      reviews: 203,
      description: "Essential amino acids for muscle recovery",
      benefits: ["Muscle Recovery", "Endurance", "Hydration"],
      servings: 40,
      flavor: "Blue Raspberry"
    },
    {
      id: 3,
      name: "Creatine Monohydrate",
      image: pre3,
      price: 4999.99,
      oldPrice: 5999.99,
      category: "strength",
      rating: 4.9,
      reviews: 328,
      description: "Pure creatine for strength and power",
      benefits: ["Strength", "Power", "Muscle Growth"],
      servings: 60,
      flavor: "Unflavored"
    },
    {
      id: 4,
      name: "Fat Burner Pro",
      image: pre4,
      price: 7999.99,
      oldPrice: 8999.99,
      category: "weight",
      rating: 4.6,
      reviews: 187,
      description: "Advanced thermogenic formula for fat loss",
      benefits: ["Fat Loss", "Energy", "Metabolism"],
      servings: 45,
      flavor: "Citrus"
    },
    {
      id: 5,
      name: "Testosterone Support",
      image: pre5,
      price: 9999.99,
      oldPrice: 11999.99,
      category: "hormone",
      rating: 4.7,
      reviews: 142,
      description: "Natural testosterone optimization formula",
      benefits: ["Hormone Support", "Strength", "Recovery"],
      servings: 30,
      flavor: "Berry Mix"
    }
  ];

  const filteredBoosters = activeCategory === 'all' 
    ? boosters 
    : boosters.filter(booster => booster.category === activeCategory);

  const handleBuyNow = (booster) => {
    navigate('/checkout', {
      state: {
        product: {
          ...booster,
          newPrice: formatPrice(booster.price),
          oldPrice: formatPrice(booster.oldPrice),
          quantity: 1
        }
      }
    });
  };

  return (
    <div className="proteins-page">
      <div className="page-header">
        <h1>Performance Boosters</h1>
        <p>Enhance your training with our premium supplements</p>
      </div>

      <div className="protein-filter-container">
        <button 
          className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All Products
        </button>
        <button 
          className={`filter-btn ${activeCategory === 'pre' ? 'active' : ''}`}
          onClick={() => setActiveCategory('pre')}
        >
          Pre-Workout
        </button>
        <button 
          className={`filter-btn ${activeCategory === 'recovery' ? 'active' : ''}`}
          onClick={() => setActiveCategory('recovery')}
        >
          Recovery
        </button>
        <button 
          className={`filter-btn ${activeCategory === 'strength' ? 'active' : ''}`}
          onClick={() => setActiveCategory('strength')}
        >
          Strength
        </button>
        <button 
          className={`filter-btn ${activeCategory === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveCategory('weight')}
        >
          Weight Management
        </button>
      </div>

      <div className="protein-showcase">
        {filteredBoosters.map((booster) => (
          <div key={booster.id} className="booster-card">
            <div className="booster-image-container">
              <img src={booster.image} alt={booster.name} />
              {booster.oldPrice && (
                <div className="discount-badge">
                  {Math.round(((booster.oldPrice - booster.price) / booster.oldPrice) * 100)}% OFF
                </div>
              )}
            </div>

            <div className="booster-content">
              <div className="booster-title-section">
                <h2>{booster.name}</h2>
                <span className="flavor-badge">{booster.flavor}</span>
              </div>

              <div className="rating-section">
                <div className="stars-container">
                  {renderStars(booster.rating)}
                </div>
                <span className="review-count">({booster.reviews} reviews)</span>
              </div>

              <div className="booster-stats">
                <div className="stat-item">
                  <span className="stat-label">Servings</span>
                  <span className="stat-value">{booster.servings}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{booster.rating}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Reviews</span>
                  <span className="stat-value">{booster.reviews}</span>
                </div>
              </div>

              <p className="booster-description">{booster.description}</p>

              <div className="benefits-container">
                {booster.benefits.map((benefit, index) => (
                  <span key={index} className="benefit-tag">{benefit}</span>
                ))}
              </div>

              <div className="booster-footer">
                <div className="price-section">
                  <span className="current-price">{formatPrice(booster.price)}</span>
                  {booster.oldPrice && (
                    <span className="old-price">{formatPrice(booster.oldPrice)}</span>
                  )}
                </div>
                <button className="order-button" onClick={() => handleBuyNow(booster)}>Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boosters; 