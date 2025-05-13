import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./Newproducts.css";

const newProducts = [
  {
    id: 11,
    name: "Applied Nutrition Whey Protein",
    brand: "Applied Nutrition",
    image: "src/assets/p2.png",
    serving: "30g per serving",
    oldPrice: "LKR 35,500",
    newPrice: "LKR 21,750",
  },
  {
    id: 12,
    name: "Applied Nutrition Mass Gainer",
    brand: "Applied Nutrition",
    image: "src/assets/p3.png",
    serving: "32g per serving",
    oldPrice: "LKR 31,000",
    newPrice: "LKR 26,500",
  },
  {
    id: 13,
    name: "Dymatize ISO100",
    brand: "Dymatize",
    image: "src/assets/new6.png",
    serving: "25g per serving",
    oldPrice: "LKR 65,200",
    newPrice: "LKR 46,900",
  },
  {
    id: 14,
    name: "BSN Syntha-6",
    brand: "BSN",
    image: "src/assets/new4.png",
    serving: "33g per serving",
    oldPrice: "LKR 11,800",
    newPrice: "LKR 8,850",
  },
  {
    id: 15,
    name: "Cellucor Cor-Performance",
    brand: "Cellucor",
    image: "src/assets/p5.png",
    serving: "28g per serving",
    oldPrice: "LKR 10,900",
    newPrice: "LKR 8,175",
  },
];

const Newproduct = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleBuyNow = (id) => {
    navigate(`/product-detail/${id}`); // Navigate to ProductDetail page with product ID
  };

  return (
    <section className="new-products-section">
      <h2 className="new-products-title">New Arrivals</h2>
      <div className="new-products-container">
        {newProducts.map((product) => (
          <div className="new-product-card" key={product.id}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="new-product-image" 
            />
            <div className="new-product-brand">{product.brand}</div>
            <h3 className="new-product-name">{product.name}</h3>
            <div className="new-product-serving">{product.serving}</div>
            <div className="new-product-prices">
              <span className="new-product-old-price">{product.oldPrice}</span>
              <span className="new-product-new-price">{product.newPrice}</span>
            </div>
            <button 
              className="new-product-buy-btn" 
              onClick={() => handleBuyNow(product.id)} // Handle button click
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Newproduct;
