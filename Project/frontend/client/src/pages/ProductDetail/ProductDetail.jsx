import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

// Import all available images
import p2 from "../../assets/p2.png"; // Chocolate
import p2_1 from "../../assets/p2_1.png"; // Vanilla
import p2_2 from "../../assets/p2_2.png"; // Strawberry
import p3 from "../../assets/p3.png";
import new6 from "../../assets/new6.png";
import new4 from "../../assets/new4.png";
import p5 from "../../assets/p5.png";

const newProducts = [
  {
    id: 11,
    name: "Applied Nutrition Whey Protein",
    brand: "Applied Nutrition",
    defaultImage: p2,
    flavorImages: {
      Chocolate: p2,
      Vanilla: p2_1,
      Strawberry: p2_2
    },
    serving: "30g per serving",
    oldPrice: "LKR 35,500",
    newPrice: "LKR 21,750",
    description: "Premium whey protein isolate with 25g protein per serving, low sugar, and digestive enzymes for optimal absorption. Ideal for post-workout recovery.",
    flavors: ["Chocolate", "Vanilla", "Strawberry"],
    rating: 4.7,
    reviews: 128,
    inStock: true,
    benefits: [
      "Supports muscle growth and repair",
      "Enhances workout recovery",
      "Contains essential amino acids",
      "Lactose-free formula"
    ],
    ingredients: "Whey Protein Isolate, Cocoa Powder, Natural Flavors, Digestive Enzyme Blend",
    usage: "Mix 1 scoop with 8-10 oz of water or milk. Consume post-workout or between meals."
  },
  {
    id: 12,
    name: "Applied Nutrition Mass Gainer",
    brand: "Applied Nutrition",
    image: p3,
    serving: "32g per serving",
    oldPrice: "LKR 31,000",
    newPrice: "LKR 26,500",
    description: "High-calorie mass gainer with optimal carb-to-protein ratio for healthy weight gain and muscle development. Provides 50g protein and 250g carbs per serving.",
    flavors: ["Chocolate", "Vanilla", "Banana"],
    rating: 4.5,
    reviews: 95,
    inStock: true,
    benefits: [
      "Promotes healthy weight gain",
      "Supports intense training recovery",
      "Contains creatine for strength",
      "Rich in essential vitamins"
    ],
    ingredients: "Protein Blend, Maltodextrin, Creatine Monohydrate, Vitamin & Mineral Mix",
    usage: "Mix 2 scoops with 16 oz of water or milk. Take 1-2 times daily with meals."
  },
  {
    id: 13,
    name: "Dymatize ISO100",
    brand: "Dymatize",
    image: new6,
    serving: "25g per serving",
    oldPrice: "LKR 65,200",
    newPrice: "LKR 46,900",
    description: "Ultra-pure whey protein isolate that's hydrolyzed for faster absorption. Contains 25g protein with less than 1g fat and sugar per serving.",
    flavors: ["Gourmet Chocolate", "Vanilla", "Birthday Cake"],
    rating: 4.8,
    reviews: 210,
    inStock: true,
    benefits: [
      "Fast-absorbing hydrolyzed protein",
      "100% whey protein isolate",
      "Gluten and lactose free",
      "Perfect for competition prep"
    ],
    ingredients: "Hydrolyzed Whey Protein Isolate, Cocoa, Natural Flavors, Stevia",
    usage: "Mix 1 scoop with 6-8 oz of water. Ideal for post-workout or morning recovery."
  },
  {
    id: 14,
    name: "BSN Syntha-6",
    brand: "BSN",
    image: new4,
    serving: "33g per serving",
    oldPrice: "LKR 11,800",
    newPrice: "LKR 8,850",
    description: "Ultra-premium protein powder with multi-stage protein blend for sustained amino acid delivery. Features 22g protein with amazing taste.",
    flavors: ["Chocolate Milkshake", "Vanilla Ice Cream", "Strawberry"],
    rating: 4.6,
    reviews: 175,
    inStock: true,
    benefits: [
      "6-protein blend for sustained release",
      "Creamy milkshake texture",
      "Supports muscle recovery",
      "Great for meal replacement"
    ],
    ingredients: "Whey Protein Concentrate, Calcium Caseinate, Micellar Casein, Egg Albumin",
    usage: "Mix 1 scoop with 8 oz of water or milk. Can be used any time of day."
  },
  {
    id: 15,
    name: "Cellucor Cor-Performance",
    brand: "Cellucor",
    image: p5,
    serving: "28g per serving",
    oldPrice: "LKR 10,900",
    newPrice: "LKR 8,175",
    description: "Whey protein powder with 25g premium protein per serving. Enhanced with digestive enzymes for better absorption and reduced bloating.",
    flavors: ["Cinnamon Swirl", "Chocolate Chip Cookie Dough", "Vanilla"],
    rating: 4.4,
    reviews: 82,
    inStock: true,
    benefits: [
      "25g protein per serving",
      "Added digestive enzymes",
      "Great for baking recipes",
      "No artificial colors"
    ],
    ingredients: "Whey Protein Blend, Cocoa, Natural Flavors, Digestive Enzyme Complex",
    usage: "Mix 1 scoop with 8 oz of liquid. Use post-workout or as a snack."
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const product = newProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  const getCurrentImage = () => {
    if (product.flavorImages) {
      const selectedFlavorName = product.flavors[selectedFlavor];
      return product.flavorImages[selectedFlavorName] || product.defaultImage;
    }
    return product.image;
  };

  const handleAddToCart = () => {
    alert(`${quantity} ${product.name} (${product.flavors[selectedFlavor]}) added to cart!`);
  };

  const handleQuickCheckout = () => {
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          selectedFlavor: product.flavors[selectedFlavor],
          quantity,
          image: getCurrentImage()
        }
      }
    });
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Products
        </button>
        <h1 className="product-title">{product.name}</h1>
      </div>

      <div className="product-detail-content">
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={getCurrentImage()} 
              alt={`${product.name} - ${product.flavors[selectedFlavor]}`}
              className="main-product-image"
            />
          </div>
          <div className="thumbnail-container">
            {product.flavorImages ? (
              product.flavors.map((flavor, index) => (
                <div 
                  key={flavor} 
                  className={`thumbnail ${selectedFlavor === index ? "active" : ""}`}
                  onClick={() => setSelectedFlavor(index)}
                >
                  <img 
                    src={product.flavorImages[flavor] || product.defaultImage} 
                    alt={`${flavor} variant`}
                    className="thumbnail-image"
                  />
                </div>
              ))
            ) : (
              <>
                <div className="thumbnail active">
                  <img src={product.image} alt="Thumbnail 1" className="thumbnail-image" />
                </div>
                <div className="thumbnail">
                  <img src={product.image} alt="Thumbnail 2" className="thumbnail-image" />
                </div>
                <div className="thumbnail">
                  <img src={product.image} alt="Thumbnail 3" className="thumbnail-image" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="product-info">
          <div className="brand-badge">{product.brand}</div>
          
          <div className="price-section">
            <span className="current-price">{product.newPrice}</span>
            {product.oldPrice && (
              <span className="original-price">{product.oldPrice}</span>
            )}
            <span className="discount-badge">
    {Math.round(
      (1 - parseFloat(product.newPrice.replace(/[^0-9.]/g, '')) / 
      parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''))) * 100
    )}% OFF
  </span>
          </div>

          <div className="rating-section">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "star filled" : "star"}>
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="review-count">({product.reviews} reviews)</span>
          </div>

          <div className="flavor-selection">
            <h4>Flavor:</h4>
            <div className="flavor-options">
              {product.flavors.map((flavor, index) => (
                <button
                  key={flavor}
                  className={`flavor-btn ${selectedFlavor === index ? "active" : ""}`}
                  onClick={() => setSelectedFlavor(index)}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-selector">
            <h4>Quantity:</h4>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="quick-checkout-btn" onClick={handleQuickCheckout}>
              Quick Checkout
            </button>
          </div>

          <div className="delivery-info">
            <div className="delivery-option">
              <span className="icon">🚚</span>
              <span>Free delivery on orders over LKR 10,000</span>
            </div>
            <div className="delivery-option">
              <span className="icon">⏱️</span>
              <span>Delivery within 2-3 business days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <button 
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button 
          className={activeTab === "benefits" ? "active" : ""}
          onClick={() => setActiveTab("benefits")}
        >
          Benefits
        </button>
        <button 
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "description" && (
          <div className="description-content">
            <h3>Product Description</h3>
            <p>{product.description}</p>
            <div className="specs">
              <h4>Specifications:</h4>
              <ul>
                <li><strong>Serving Size:</strong> {product.serving}</li>
                <li><strong>Flavor:</strong> {product.flavors.join(", ")}</li>
                <li><strong>Brand:</strong> {product.brand}</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="benefits-content">
            <h3>Key Benefits</h3>
            <ul>
              {product.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-content">
            <h3>Customer Reviews</h3>
            <div className="review-summary">
              <div className="average-rating">
                <span className="big-rating">{product.rating}</span>/5
              </div>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar">
                    <span>{star} star</span>
                    <div className="bar-container">
                      <div 
                        className="bar" 
                        style={{ width: `${(star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="customer-review">
              <div className="review-header">
                <span className="reviewer-name">Kasun Sandakalum</span>
                <span className="review-rating">★★★★★</span>
              </div>
              <p className="review-text">"This protein powder mixes well and tastes great. I've noticed significant muscle recovery improvement since I started using it."</p>
              <span className="review-date">Posted on March 15, 2023</span>
            </div>
          </div>
        )}
      </div>

      <div className="frequently-bought">
  <h3>Frequently Bought Together</h3>
  <div className="related-products">
    {newProducts.filter(p => p.id !== product.id).slice(0, 3).map(related => (
      <div key={related.id} className="related-product">
        <img 
          src={related.image || related.defaultImage}  // Fixed: Use image or defaultImage
          alt={related.name}
          className="related-product-image"
        />
        <span className="related-name">{related.name}</span>
        <span className="related-price">{related.newPrice}</span>
        <button className="add-related">+ Add</button>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default ProductDetail;