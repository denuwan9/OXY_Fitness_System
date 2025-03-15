import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.firstName.match(nameRegex)) {
      newErrors.firstName = "First name should contain only letters and spaces.";
    }
    if (!formData.lastName.match(nameRegex)) {
      newErrors.lastName = "Last name should contain only letters and spaces.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone number validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!formData.phone.match(phoneRegex)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Account created successfully!");
      // Add form submission logic here (e.g., API call)
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  return (
    <div className="signup-page">
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

      {/* Signup Form Container */}
      <div className="container">
        {/* Left Column (Image) */}
        <div className="left-column"></div>

        {/* Right Column (Form) */}
        <div className="right-column">
          <h2>Create an account</h2>
          <p>Let's get started</p>
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>

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

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
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

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">I've read and agree with terms of service and our privacy policy</label>
            </div>

            {/* Create Account Button */}
            <div className="form-group">
              <button type="submit">Create Account</button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="signin-link">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
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

export default Signup;