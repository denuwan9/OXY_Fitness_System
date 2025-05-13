import './Header.css';
import bell from '../../assets/bell.png';  // Updated path
import profileimg from '../../assets/profileimg.png';  // Updated path

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user);
  const [profileImage, setProfileImage] = useState(profileimg);
  const [activeNotification, setActiveNotification] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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
    <>
      {/* Header */}
      <header className={`header1 ${scrollPosition > 50 ? 'scrolled' : ''}`}>
        <motion.div 
          className="logo1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/')}
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
              <Link to="/contactus">Contacts</Link>
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
    </>
  );
};

export default Header;