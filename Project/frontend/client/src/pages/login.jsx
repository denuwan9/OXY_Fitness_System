import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { post } from "../services/ApiEndpoint";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../services/api";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.match(emailRegex)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email cannot exceed 254 characters.";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const request = await post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const response = request.data;

        if (request.status === 200) {
          dispatch(SetUser(response.user));
          localStorage.setItem("token", response.token);
          toast.success(response.message);
          if (response.user.role === "admin") {
            navigate("/admin");
          } else if (response.user.role === "user") {
            navigate("/");
          }else if (response.user.role === "trainer") {
            navigate("/coach/schedule-manager");
          }else if (response.user.role === "operation-manager") {
            navigate("/operation-manager/schedule-requests");
          }
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      }
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Column (Image) */}
        <motion.div
          className="left-column1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Right Column (Form) */}
        <motion.div
          className="right-column1"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          </form>

          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
