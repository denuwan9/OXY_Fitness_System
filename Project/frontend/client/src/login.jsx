import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Login successful!");
      // Add form submission logic here (e.g., API call)
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header>
        <div className="logo">OXY FITNESS</div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Coaches</a></li>
            <li><a href="#">Programs</a></li>
            <li><a href="#">Memberships</a></li>
            <li><a href="#">Contacts</a></li>
            <li><a href="#">Shop</a></li>
          </ul>
        </nav>
        <div className="user-profile">
          <img src="/images/bell.png" alt="Bell Icon" className="bell-icon" /> 
          <img
            src="/images/profileimg.png" 
            alt="Profile"
            className="profile-img"
            onClick={handleProfileClick} // Add onClick handler
            style={{ cursor: "pointer" }} // Add pointer cursor
          />
        </div>
      </header>

      {/* Login Form Container */}
      <div className="container">
        {/* Left Column (Image) */}
        <div className="left-column"></div>

        {/* Right Column (Form) */}
        <div className="right-column">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            {/* Login Button */}
            <div className="form-group">
              <button type="submit">Login</button>
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <a href="#forgot-password">Forgot Password?</a>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

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
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
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
              <li>
                <i className="fas fa-map-marker-alt"></i> 123 Fitness Street, Colombo, Sri Lanka
              </li>
              <li>
                <i className="fas fa-phone"></i> +94 112 345 678
              </li>
              <li>
                <i className="fas fa-envelope"></i> info@oxyfitness.com
              </li>
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

export default Login;