import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import profileimg from './images/profileimg.png';
import bell from './images/bell.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user);
  const [profileImage, setProfileImage] = useState(profileimg);
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

  // Fetch profile image when component mounts
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(`http://localhost:6017/api/upload/profile-image/${user._id}`);
        if (response.data.success && response.data.imageUrl) {
          setProfileImage(`http://localhost:6017${response.data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setProfileImage(profileimg); // Use default image if fetch fails
      }
    };

    fetchProfileImage();
  }, [user?._id]);

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
      {/*
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
                          <Link to="/">Home</Link>
                        </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="#">Coaches</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="#">Programs</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="/membership">Memberships</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="#">Contacts</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
  <Link to="/shop">Shop</Link>
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
            src={profileImage}
            alt="Profile" 
            className="profileImg1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = profileimg;
            }}
          />
        </div>
      </header>
*/}
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
                "Standard training time slots",
                "Basic supplement allowance",
                "1-month validity",
                "Limited class access"
              ],
              popular: false
            },
            {
              name: "Gold",
              price: "$49/month",
              features: [
                "Extended training hours",
                "Increased supplement allowance",
                "3-month validity",
                "Advanced class selection"
                
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
                onClick={() => navigate('/membership')}
              >
                Sign Up
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      

      {/* Footer Section */}
      
      
    </div>
  );
};

export default Home;