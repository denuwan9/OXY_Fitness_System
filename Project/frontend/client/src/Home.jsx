import React from 'react';
import { useNavigate } from 'react-router-dom';
import profileimg from './images/profileimg.png';
import bell from './images/bell.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Header */}
      <header className="header1">
      <div className="logo1">OXY FITNESS</div>
      <nav className="nav1">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Coaches</a></li>
          <li><a href="#">Programs</a></li>
          <li><a href="#">Memberships</a></li>
          <li><a href="#">Contacts</a></li>
          <li><a href="#">Shop</a></li>
        </ul>
      </nav>
      <div className="userProfile1">
        <img 
          src={bell}
          alt="Bell Icon" 
          className="bellIcon1" 
        />
        <img 
          src={profileimg}
          alt="Profile" 
          className="profileImg1" 
          onClick={() => navigate('/profile')} 
        />
      </div>
    </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Fitness Journey</h1>
          <p>Your all-in-one solution for gym management and fitness tracking.</p>
          <div className="hero-buttons">
            <button className="cta-button" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features" id="features">
        <h2>Why Choose OXY Fitness?</h2>
        <div className="feature-cards">
          <div className="card">
            <div className="icon">💪</div>
            <h3>Easy Membership</h3>
            <p>Manage your membership with ease.</p>
          </div>
          <div className="card">
            <div className="icon">📅</div>
            <h3>Class Scheduling</h3>
            <p>Book and track your classes effortlessly.</p>
          </div>
          <div className="card">
            <div className="icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your fitness journey.</p>
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="membership" id="membership">
        <h2>Membership Plans</h2>
        <div className="plan-cards">
          <div className="plan-card">
            <h3>Basic</h3>
            <p className="price">$29/month</p>
            <ul>
              <li>Access to all equipment</li>
              <li>Group classes</li>
            </ul>
            <button className="cta-button">Sign Up</button>
          </div>
          <div className="plan-card">
            <h3>Premium</h3>
            <p className="price">$49/month</p>
            <ul>
              <li>All Basic features</li>
              <li>Personal training</li>
              <li>24/7 access</li>
            </ul>
            <button className="cta-button">Sign Up</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-heading">About OXY FITNESS</h3>
            <p className="footer-text">
              OXY FITNESS is your ultimate destination for fitness and wellness. We offer premium supplements, expert coaching, and top-notch fitness programs to help you achieve your goals.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Coaches</a></li>
              <li><a href="#">Programs</a></li>
              <li><a href="#">Memberships</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt"></i> 123 Fitness Street, Colombo, Sri Lanka</li>
              <li><i className="fas fa-phone"></i> +94 112 345 678</li>
              <li><i className="fas fa-envelope"></i> info@oxyfitness.com</li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="footer-section">
            <h3 className="footer-heading">Subscribe to Our Newsletter</h3>
            <p className="footer-text">
              Get the latest updates on fitness tips, exclusive offers, and new products.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2023 OXY FITNESS. All rights reserved.</p>
          <ul className="footer-legal">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;