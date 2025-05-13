import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { post } from "../services/ApiEndpoint";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.match(emailRegex)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email cannot exceed 254 characters.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!formData.phone.match(phoneRegex)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!formData.password.match(passwordRegex)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, and special character.";
    } else if (formData.password.length > 68) {
      newErrors.password = "Password cannot exceed 68 characters.";
    }

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
    return Object.keys(newErrors).length === 0;
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

      const response = request.data;

      if (request.status === 200) {
        toast.success(response.message);
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Check if it's an axios error with response
      if (error.response) {
        // Handle 409 Conflict (email already exists)
        if (error.response.status === 409) {
          setErrors(prev => ({
            ...prev,
            email: "This email is already registered. Please use a different email or login."
          }));
          toast.error("This email is already registered.");
          return;
        }
        
        // Handle other error responses with messages
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
          return;
        }
      }
      
      // Fallback error message
      toast.error("Account creation failed. Please try again.");
    }
  } else {
    toast.error("Please fix the errors in the form.");
  }
};

  return (
    <div
      className="signup-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <div className="left-column" />

        <motion.div
          className="right-column"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Create an account
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Let's get started
          </motion.p>

          <form onSubmit={handleSubmit}>
            {[
              { id: "firstName", label: "First Name" },
              { id: "lastName", label: "Last Name" },
              { id: "address", label: "Address" },
              { id: "city", label: "City" },
              { id: "phone", label: "Phone Number", type: "tel" },
              { id: "email", label: "Email", type: "email" },
              { id: "password", label: "Password", type: "password" },
              { id: "confirmPassword", label: "Confirm Password", type: "password" },
            ].map(({ id, label, type = "text" }, index) => (
              <motion.div
                className="form-group"
                key={id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <label htmlFor={id}>{label}</label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                />
                {errors[id] && <span className="error">{errors[id]}</span>}
              </motion.div>
            ))}

            <div className="form-group checkbox">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">
                I've read and agree with terms of service and our privacy policy
              </label>
            </div>

            <div className="form-group">
              <button type="submit">Create Account</button>
            </div>

            <div className="signin-link">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
