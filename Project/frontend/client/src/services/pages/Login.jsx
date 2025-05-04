import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await api.post('/auth/login', formData);
        const { token, user } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Update auth context
        login(user);

        // Redirect based on role
        switch (user.role) {
          case 'member':
            navigate('/schedule');
            break;
          case 'coach':
            navigate('/schedule/availability');
            break;
          case 'manager':
            navigate('/schedule/manager');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'supplier':
            navigate('/supplier/dashboard');
            break;
          default:
            console.warn('Unknown role:', user.role);
            navigate('/');
        }
      } catch (error) {
        setErrors({
          submit: error.response?.data?.message || 'Login failed. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
          <div className="login-left">
            <img src="/images/login-bg.jpg" alt="Login Background" />
          </div>
          <div className="login-right">
            <h2>Welcome Back</h2>
            <p>Please login to your account</p>
            {errors.submit && (
              <div className="error-alert">
                {errors.submit}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="login-footer">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login; 