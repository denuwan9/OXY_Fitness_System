import React, { useState } from 'react';
import './VitaminProducts.css';
import v1 from '../../assets/v1 (1).png';
import v2 from '../../assets/v2.png';
import v3 from '../../assets/v3.png';
import v4 from '../../assets/v4.png';
import v5 from '../../assets/v5.png';
import v6 from '../../assets/v6.png';
import v7 from '../../assets/v7.png';
import v8 from '../../assets/v8.png';

const vitaminProducts = [
  {
    id: 1,
    name: "Vitamin D3 + K2",
    brand: "Nature's Best",
    image: v2,
    price: 4500,
    oldPrice: 6000,
    category: "immune",
    description: "Supports bone health and immune system",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Vitamin C Complex",
    brand: "Health Plus",
    image: v3,
    price: 3800,
    oldPrice: 4800,
    category: "immune",
    description: "Antioxidant support and immune boost",
    rating: 4.6,
    reviews: 98
  },
  {
    id: 3,
    name: "Omega-3 Fish Oil",
    brand: "Pure Health",
    image: v1,
    price: 5200,
    oldPrice: 6500,
    category: "heart",
    description: "Supports heart and brain health",
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: "B-Complex",
    brand: "Vitality",
    image: v4,
    price: 4200,
    oldPrice: 5500,
    category: "energy",
    description: "Energy and metabolism support",
    rating: 4.7,
    reviews: 112
  },
  {
    id: 5,
    name: "Vitamin E",
    brand: "Nature's Best",
    image: v6,
    price: 3500,
    oldPrice: 4500,
    category: "immune",
    description: "Antioxidant protection for cells",
    rating: 4.5,
    reviews: 89
  },
  {
    id: 6,
    name: "Zinc Supplement",
    brand: "Health Plus",
    image: v7,
    price: 2800,
    oldPrice: 3500,
    category: "immune",
    description: "Immune system support",
    rating: 4.7,
    reviews: 76
  },
  {
    id: 7,
    name: "Magnesium Complex",
    brand: "Pure Health",
    image: v8,
    price: 3900,
    oldPrice: 4900,
    category: "energy",
    description: "Muscle and nerve function support",
    rating: 4.8,
    reviews: 103
  },
  {
    id: 8,
    name: "Iron Supplement",
    brand: "Vitality",
    image: v5,
    price: 3200,
    oldPrice: 4000,
    category: "energy",
    description: "Energy and blood health support",
    rating: 4.6,
    reviews: 92
  }
];

const VitaminProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = vitaminProducts
    .filter(product => {
      if (selectedCategory === 'all') return true;
      return product.category === selectedCategory;
    })
    .filter(product => product.price <= priceRange)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // default: popular
    });

  return (
    <div className="vitamin-products-container">
      <div className="filters-section">
        <div className="filter-group">
          <h3>Category</h3>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="immune">Immune Support</option>
            <option value="heart">Heart Health</option>
            <option value="energy">Energy & Metabolism</option>
          </select>
        </div>

        <div className="filter-group">
          <h3>Price Range</h3>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="price-slider"
          />
          <span className="price-value">Up to LKR {priceRange.toLocaleString()}</span>
        </div>

        <div className="filter-group">
          <h3>Sort By</h3>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="vitamin-card">
            <div className="card-badge">-{Math.round((1 - product.price/product.oldPrice) * 100)}%</div>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <span className="brand-name">{product.brand}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? "star filled" : "star"}>
                    {i < Math.floor(product.rating) ? "★" : "☆"}
                  </span>
                ))}
                <span className="review-count">({product.reviews})</span>
              </div>
              <div className="price-section">
                <span className="current-price">LKR {product.price.toLocaleString()}</span>
                <span className="old-price">LKR {product.oldPrice.toLocaleString()}</span>
              </div>
              <button className="add-to-cart-btn">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitaminProducts; 