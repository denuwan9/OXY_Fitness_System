import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
function Footer() {
  const navigate = useNavigate();
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="footer-container">
        {/* About Section */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="footer-heading">About OXY FITNESS</h3>
          <p className="footer-text">
            OXY FITNESS is your ultimate destination for fitness and wellness. We offer premium supplements, expert coaching, and top-notch fitness programs to help you achieve your goals.
          </p>
          <div className="social-icons">
            <motion.a 
              href="#" 
              className="social-icon"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-icon"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-icon"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-icon"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </motion.a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <motion.li whileHover={{ x: 5 }}>
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="#">Coaches</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="#">Programs</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="/membership">Memberships</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="/shop">Shop</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="/contactus">Contact Us</Link>
            </motion.li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-contact">
            <motion.li whileHover={{ x: 5 }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Fitness Street, Kadawatha, Sri Lanka
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <FontAwesomeIcon icon={faPhone} /> +94 112 345 678
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <FontAwesomeIcon icon={faEnvelope} /> oxifitness01@gmai.com
            </motion.li>
          </ul>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="footer-heading">Subscribe to Our Newsletter</h3>
          <p className="footer-text">
            Get the latest updates on fitness tips, exclusive offers, and new products.
          </p>
          <form className="newsletter-form">
            <motion.input 
              type="email" 
              placeholder="Enter your email" 
              required 
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05, backgroundColor: "#ff6b6b" }}
              whileTap={{ scale: 0.95 }}
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
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        <p>&copy; 2023 OXY FITNESS. All rights reserved.</p>
        <ul className="footer-legal">
          <motion.li whileHover={{ scale: 1.05 }}>
            <a href="#">Privacy Policy</a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }}>
            <a href="#">Terms & Conditions</a>
          </motion.li>
        </ul>
      </motion.div>
    </motion.footer>
  );
}

export default Footer;