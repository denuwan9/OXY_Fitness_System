import React, { useState, useEffect, useRef } from "react";
import "./ProductCard.css";

const products = [
  {
    id: 1,
    name: "Vital Strength High Protein",
    image: "src/assets/sup2.png",
    serving: "40g per serving",
    oldPrice: "LKR 10,000",
    newPrice: "LKR 6,000",
  },
  {
    id: 2,
    name: "Vital Strength Ripped Protein",
    image: "src/assets/sup3.png",
    serving: "35g per serving",
    oldPrice: "LKR 9,500",
    newPrice: "LKR 5,700",
  },
  {
    id: 3,
    name: "Vital Strength Sport Protein",
    image: "src/assets/sup4.png",
    serving: "30g per serving",
    oldPrice: "LKR 8,500",
    newPrice: "LKR 5,100",
  },
  {
    id: 4,
    name: "Vital Strength Mass Protein",
    image: "src/assets/sup5.png",
    serving: "50g per serving",
    oldPrice: "LKR 12,000",
    newPrice: "LKR 7,200",
  },
  {
    id: 5,
    name: "Vital Strength Whey Protein",
    image: "src/assets/sup8.png",
    serving: "32g per serving",
    oldPrice: "LKR 11,000",
    newPrice: "LKR 6,600",
  },
  {
    id: 6,
    name: "Vital Strength Pre-Workout",
    image: "src/assets/sup6.png",
    serving: "32g per serving",
    oldPrice: "LKR 11,000",
    newPrice: "LKR 6,600",
  },
  {
    id: 7,
    name: "Vital Strength Ripped Protein",
    image: "src/assets/sup10.png",
    serving: "16g per serving",
    oldPrice: "LKR 15,000",
    newPrice: "LKR 8,600",
  },
];

const ProductCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Calculate maximum index based on visible cards
  const maxIndex = Math.max(0, products.length - visibleCards);

  // Handle automatic swiping
  useEffect(() => {
    const startAutoSwipe = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 3000);
    };

    startAutoSwipe();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visibleCards, maxIndex]);

  // Handle responsive number of visible cards
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the transform value for the sliding effect
  const getTransformValue = () => {
    if (!containerRef.current || !containerRef.current.children[0]) {
      return 'translateX(0)';
    }
    
    const card = containerRef.current.children[0];
    const cardWidth = card.offsetWidth;
    const gap = 20;
    
    const transformValue = -Math.min(
      currentIndex * (cardWidth + gap + 30),
      maxIndex * (cardWidth + gap + 30)
    );
    return `translateX(${transformValue}px)`;
  };

  // Handle manual navigation
  const goToIndex = (newIndex) => {
    if (newIndex >= 0 && newIndex <= maxIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="product-carousel">
      <button 
        className="product-carousel__arrow product-carousel__arrow--prev" 
        onClick={() => goToIndex(currentIndex - 1)}
        aria-label="Previous products"
      >
        &lt;
      </button>
      
      <div 
        className="product-carousel__container" 
        ref={containerRef}
        style={{
          transform: getTransformValue(),
          transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
          width: 'calc(100% - 60px)'
        }}
      >
        {products.map((product) => (
          <div className="product-carousel__card" key={product.id}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-carousel__image" 
            />
            <h3 className="product-carousel__name">{product.name}</h3>
            <p className="product-carousel__serving">{product.serving}</p>
            <div className="product-carousel__price">
              <span className="product-carousel__price-old">{product.oldPrice}</span>
              <span className="product-carousel__price-new">{product.newPrice}</span>
            </div>
            <span className="product-carousel__badge">40% OFF</span>
            <button className="product-carousel__button">Buy Now</button>
          </div>
        ))}
      </div>
      
      <button 
        className="product-carousel__arrow product-carousel__arrow--next" 
        onClick={() => goToIndex(currentIndex + 1)}
        aria-label="Next products"
      >
        &gt;
      </button>
      
      {/* Navigation dots */}
      <div className="product-carousel__dots">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`product-carousel__dot ${
              index === currentIndex ? 'product-carousel__dot--active' : ''
            }`}
            onClick={() => goToIndex(index)}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCard;