import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>OXY Fitness is your premier destination for health and wellness. We offer state-of-the-art facilities and expert trainers to help you achieve your fitness goals.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/classes">Classes</Link></li>
            <li><Link to="/trainers">Trainers</Link></li>
            <li><Link to="/schedule">Schedule</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>123 Fitness Street</li>
            <li>City, State 12345</li>
            <li>Phone: (123) 456-7890</li>
            <li>Email: info@oxyfitness.com</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} OXY Fitness. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 