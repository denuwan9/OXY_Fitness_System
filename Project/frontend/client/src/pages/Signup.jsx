import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Signup.css";
import { post } from "../services/ApiEndpoint";
import { toast } from "react-hot-toast"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

   // Name validation (only letters, spaces, and hyphens/apostrophes for international names)
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
if (!formData.firstName.trim()) {
  newErrors.firstName = "First name is required.";
} else if (!formData.firstName.match(nameRegex)) {
  newErrors.firstName = "First name contains invalid characters.";
} else if (formData.firstName.length < 2) {
  newErrors.firstName = "First name must be at least 2 characters.";
} else if (formData.firstName.length > 50) {
  newErrors.firstName = "First name cannot exceed 50 characters.";
}

if (!formData.lastName.trim()) {
  newErrors.lastName = "Last name is required.";
} else if (!formData.lastName.match(nameRegex)) {
  newErrors.lastName = "Last name contains invalid characters.";
} else if (formData.lastName.length < 2) {
  newErrors.lastName = "Last name must be at least 2 characters.";
} else if (formData.lastName.length > 50) {
  newErrors.lastName = "Last name cannot exceed 50 characters.";
}

// Email validation (more comprehensive)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!formData.email.trim()) {
  newErrors.email = "Email is required.";
} else if (!formData.email.match(emailRegex)) {
  newErrors.email = "Please enter a valid email address (e.g., user@example.com).";
} else if (formData.email.length > 254) {
  newErrors.email = "Email cannot exceed 254 characters.";
}

// Phone number validation (international format)
const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
if (!formData.phone.trim()) {
  newErrors.phone = "Phone number is required.";
} else if (!formData.phone.match(phoneRegex)) {
  newErrors.phone = "Please enter a valid phone number (e.g., +1234567890).";
}

// Strong password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!formData.password) {
  newErrors.password = "Password is required.";
} else if (formData.password.length < 8) {
  newErrors.password = "Password must be at least 8 characters long.";
} else if (!formData.password.match(passwordRegex)) {
  newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
} else if (formData.password.length > 128) {
  newErrors.password = "Password cannot exceed 128 characters.";
}

// Confirm password validation
if (!formData.confirmPassword) {
  newErrors.confirmPassword = "Please confirm your password.";
} else if (formData.password !== formData.confirmPassword) {
  newErrors.confirmPassword = "Passwords do not match.";
}

if (!formData.address) {
  newErrors.address = "Address is required.";
}

if (!formData.city) {
  newErrors.city = "City is required.";
}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const request = await post("/api/auth/register", {
          fname: formData.firstName,
          lname: formData.lastName,
          address: formData.address,
          city: formData.city,
          number: formData.phone,
          email: formData.email,
          password: formData.password,
        });

        const response = request.data

        if (request.status === 200) {
          toast.success(response.message); 
          navigate("/login");
        }
        console.log(response);

        
      } catch (error) {
        console.log(error);
        alert("Account creation failed. Please try again.");
      }
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  return (
    <div className="signup-page">
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

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <span className="error">{errors.city}</span>}
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
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">
                I've read and agree with terms of service and our privacy policy
              </label>
            </div>

            {/* Create Account Button */}
            <div className="form-group">
              <button type="submit">Create Account</button>
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <a href="#forgot-password">Forgot Password?</a>
            </div>

            {/* Sign In Link */}
            <div className="signin-link">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;