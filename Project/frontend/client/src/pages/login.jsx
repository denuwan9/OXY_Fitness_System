import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure this is the correct CSS file
import { post } from "../services/ApiEndpoint";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };


  const navigate = useNavigate()


  const validateForm = () => {
    const newErrors = {};

    // Email validation (more comprehensive)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!formData.email.trim()) {
  newErrors.email = "Email is required.";
} else if (!formData.email.match(emailRegex)) {
  newErrors.email = "Please enter a valid email address ";
} else if (formData.email.length > 254) {
  newErrors.email = "Email cannot exceed 254 characters.";
}

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email: formData.email, password: formData.password })
    // Validate the form
    if (validateForm()) {
      try {
        const request = await post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        })

        const response = request.data

        if (request.status === 200) {
          if (response.user.role == 'admin') {
            navigate("/admin")
          } else if (response.user.role == 'user') {
            navigate("/")
          }
          toast.success(response.message); // Use toast for success message
          dispatch(SetUser(response.user)); // Update Redux state
        } localStorage.setItem("token", response.token);
        console.log(response);
      } catch (error) {
        toast.error("Login failed. Please try again."); // Use toast for error message
      }
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