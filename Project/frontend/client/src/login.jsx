import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure this is the correct CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    return Object.keys(newErrors).length === 0;
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

  return (
    <div className="login-page">
      {/* Login Form Container */}
      <div className="container">
        {/* Left Column (Image) */}
        <div className="left-column1"></div>

        {/* Right Column (Form) */}
        <div className="right-column1">
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
    </div>
  );
};

export default Login;