import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Proteins.css';
import pr1 from '../../assets/pr1.png';
import pr2 from '../../assets/pr2.png';
import pr3 from '../../assets/pr3.png';
import pr4 from '../../assets/pr4.png';
import pr5 from '../../assets/pr5.png';

const Proteins = () => {
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Proteins component mounted');
  }, []);

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const proteins = [
    {
      id: 1,
      name: "Whey Protein Isolate",
      image: pr1,
      price: 12999.99,
      oldPrice: 14999.99,
      type: "whey",
      flavor: "Chocolate",
      servingSize: "30g",
      servings: 30,
      protein: "24g",
      description: "Pure and fast-absorbing protein for muscle recovery",
      features: ["Low Carb", "Lactose Free", "BCAA Rich"]
    },
    {
      id: 2,
      name: "Mass Gainer Pro",
      image: pr2,
      price: 15999.99,
      oldPrice: 17999.99,
      type: "mass",
      flavor: "Vanilla",
      servingSize: "150g",
      servings: 20,
      protein: "50g",
      description: "High-calorie formula for muscle mass gain",
      features: ["High Calories", "Complex Carbs", "Creatine"]
    },
    {
      id: 3,
      name: "Plant Protein Blend",
      image: pr3,
      price: 11999.99,
      oldPrice: 13999.99,
      type: "vegan",
      flavor: "Berry",
      servingSize: "35g",
      servings: 25,
      protein: "22g",
      description: "Complete plant-based protein for all diets",
      features: ["Vegan", "Gluten Free", "Organic"]
    },
    {
      id: 4,
      name: "Casein Protein",
      image: pr4,
      price: 13999.99,
      oldPrice: 15999.99,
      type: "casein",
      flavor: "Cookies & Cream",
      servingSize: "33g",
      servings: 28,
      protein: "25g",
      description: "Slow-digesting protein for overnight recovery",
      features: ["Night Time", "Anti-Catabolic", "Rich in Calcium"]
    },
    {
      id: 5,
      name: "Protein Blend Matrix",
      image: pr5,
      price: 14999.99,
      oldPrice: 16999.99,
      type: "blend",
      flavor: "Chocolate",
      servingSize: "40g",
      servings: 30,
      protein: "30g",
      description: "Multi-source protein for sustained release",
      features: ["Multi-Source", "Digestive Enzymes", "No Artificial Colors"]
    }
  ];

  const filteredProteins = selectedType === 'all' 
    ? proteins 
    : proteins.filter(protein => protein.type === selectedType);

  const handleBuyNow = (protein) => {
    navigate('/checkout', {
      state: {
        product: {
          ...protein,
          newPrice: formatPrice(protein.price),
          oldPrice: formatPrice(protein.oldPrice),
          quantity: 1
        }
      }
    });
  };

  const handleViewDetails = (protein) => {
    navigate(`/product-detail/${protein.id}`, {
      state: {
        product: {
          ...protein,
          newPrice: formatPrice(protein.price),
          oldPrice: formatPrice(protein.oldPrice)
        }
      }
    });
  };

  return (
    <div className="proteins-page">
      <div className="page-header">
        <h1>Premium Protein Supplements</h1>
        <p>Fuel your fitness journey with our high-quality protein range</p>
      </div>

      <div className="protein-filter-container">
        <button 
          className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          All Products
        </button>
        <button 
          className={`filter-btn ${selectedType === 'whey' ? 'active' : ''}`}
          onClick={() => setSelectedType('whey')}
        >
          Whey Protein
        </button>
        <button 
          className={`filter-btn ${selectedType === 'mass' ? 'active' : ''}`}
          onClick={() => setSelectedType('mass')}
        >
          Mass Gainers
        </button>
        <button 
          className={`filter-btn ${selectedType === 'vegan' ? 'active' : ''}`}
          onClick={() => setSelectedType('vegan')}
        >
          Plant Based
        </button>
      </div>

      <div className="protein-showcase">
        {filteredProteins.map((protein) => (
          <div key={protein.id} className="protein-item">
            <div className="protein-image-wrapper" onClick={() => handleViewDetails(protein)}>
              <img src={protein.image} alt={protein.name} />
              {protein.oldPrice && (
                <div className="savings-tag">
                  Save {Math.round(((protein.oldPrice - protein.price) / protein.oldPrice) * 100)}%
                </div>
              )}
            </div>
            
            <div className="protein-details">
              <div className="protein-header">
                <h2 onClick={() => handleViewDetails(protein)}>{protein.name}</h2>
                <span className="flavor-tag">{protein.flavor}</span>
              </div>

              <div className="nutrition-info">
                <div className="info-item">
                  <span className="label">Serving Size</span>
                  <span className="value">{protein.servingSize}</span>
                </div>
                <div className="info-item">
                  <span className="label">Servings</span>
                  <span className="value">{protein.servings}</span>
                </div>
                <div className="info-item">
                  <span className="label">Protein</span>
                  <span className="value">{protein.protein}</span>
                </div>
              </div>

              <p className="protein-description">{protein.description}</p>

              <div className="features-grid">
                {protein.features.map((feature, index) => (
                  <span key={index} className="feature-pill">{feature}</span>
                ))}
              </div>

              <div className="price-action">
                <div className="price-info">
                  <span className="current-price">{formatPrice(protein.price)}</span>
                  {protein.oldPrice && (
                    <span className="original-price">{formatPrice(protein.oldPrice)}</span>
                  )}
                </div>
                <button className="purchase-btn" onClick={() => handleBuyNow(protein)}>Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proteins; 