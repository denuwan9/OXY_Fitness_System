import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import profileimg from './images/profileimg.png';
import bell from './images/bell.png';
import './Home.css';
import { Link } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const [activeNotification, setActiveNotification] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNotification = () => {
    setActiveNotification(!activeNotification);
  };

  const togglePlan = (index) => {
    setActivePlan(activePlan === index ? null : index);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const planVariants = {
    inactive: {
      scale: 1,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    },
    active: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="home">
      {/* Header */}
      <header className={`header1 ${scrollPosition > 50 ? 'scrolled' : ''}`}>
        <motion.div 
          className="logo1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          OXY FITNESS
        </motion.div>
        
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          <div className={`menu-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`menu-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`menu-line ${isMenuOpen ? 'open' : ''}`}></div>
        </div>
        
        <nav className={`nav1 ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#">Home</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#">Coaches</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/schedule" className="menu-button">Programs</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#">Memberships</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#">Contacts</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#">Shop</a>
            </motion.li>
          </ul>
        </nav>
        
        <div className="userProfile1">
          <motion.div 
            className="notification-icon"
            whileTap={{ scale: 0.9 }}
            onClick={toggleNotification}
          >
            <img src={bell} alt="Bell Icon" className="bellIcon1" />
            
          </motion.div>
          
          
          
          <motion.img 
            src={profileimg}
            alt="Profile" 
            className="profileImg1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your <span className="highlight">Fitness Journey</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your all-in-one solution for gym management and fitness tracking.
          </motion.p>
          
          
        </div>
        
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="pulse-circle"></div>
          <div className="pulse-circle-small"></div>
        </motion.div>
      </section>

      {/* Key Features Section */}
      <section className="features" id="features">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          Why Choose <span className="highlight">OXY Fitness</span>?
        </motion.h2>
        
        <div className="feature-cards">
          {[
            {
              icon: "💪",
              title: "Easy Membership",
              description: "Manage your membership with ease through our intuitive platform."
            },
            {
              icon: "📅",
              title: "Class Scheduling",
              description: "Book and track your classes effortlessly with real-time updates."
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              description: "Monitor your fitness journey with detailed analytics and insights."
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={featureVariants}
              whileHover={{ y: -10 }}
            >
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="membership" id="membership">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Membership <span className="highlight">Plans</span>
        </motion.h2>
        
        <div className="plan-cards">
          {[
            {
              name: "Silver",
              price: "$29/month",
              features: [
                "Access to all equipment",
                "Group classes",
                "Locker access",
                "Basic workout plan"
              ],
              popular: false
            },
            {
              name: "Gold",
              price: "$49/month",
              features: [
                "All Silver features",
                "Personal training (2 sessions)",
                "24/7 access",
                "Advanced workout plan",
                "Nutrition guidance"
              ],
              popular: true
            }
          ].map((plan, index) => (
            <motion.div 
              key={index}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
              variants={planVariants}
              animate={activePlan === index ? "active" : "inactive"}
              onClick={() => togglePlan(index)}
              whileHover={{ scale: 1.02 }}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <motion.button 
                className="cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          {/* About Section */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="footer-heading">About OXY FITNESS</h3>
            <p className="footer-text">
              OXY FITNESS is your ultimate destination for fitness and wellness. We offer premium supplements, expert coaching, and top-notch fitness programs to help you achieve your goals.
            </p>
            <div className="social-icons">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="social-icon"
                  whileHover={{ y: -3, color: "#ff6b6b" }}
                  transition={{ duration: 0.2 }}
                >
                  <i className={`fab fa-${icon}`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {['Home', 'Coaches', 'Programs', 'Memberships', 'Shop', 'Contact Us'].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#">{link}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt"></i> 123 Fitness Street, Colombo, Sri Lanka</li>
              <li><i className="fas fa-phone"></i> +94 112 345 678</li>
              <li><i className="fas fa-envelope"></i> info@oxyfitness.com</li>
            </ul>
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="footer-heading">Subscribe to Our Newsletter</h3>
            <p className="footer-text">
              Get the latest updates on fitness tips, exclusive offers, and new products.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>&copy; {new Date().getFullYear()} OXY FITNESS. All rights reserved.</p>
          <ul className="footer-legal">
            <motion.li whileHover={{ scale: 1.05 }}>
              <a href="#">Privacy Policy</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }}>
              <a href="#">Terms & Conditions</a>
            </motion.li>
          </ul>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;