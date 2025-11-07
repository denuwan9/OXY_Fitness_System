// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/ApiEndpoint';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
<<<<<<< Updated upstream
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
=======
>>>>>>> Stashed changes
  const navigate = useNavigate();

  const { currentPassword, newPassword, confirmPassword } = formData;

<<<<<<< Updated upstream
  // Password regex that requires at least one uppercase, one lowercase, 
  // one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (name === 'newPassword') {
      if (!value) {
        errorMsg = "Password is required.";
      } else if (value.length < 8) {
        errorMsg = "Password must be at least 8 characters long.";
      } else if (!value.match(passwordRegex)) {
        errorMsg = "Password must contain uppercase, lowercase, number, and special character.";
      } else if (value.length > 68) {
        errorMsg = "Password cannot exceed 68 characters.";
      }
    } else if (name === 'confirmPassword') {
      if (value !== newPassword) {
        errorMsg = "Passwords do not match";
      }
    } else if (name === 'currentPassword' && !value) {
      errorMsg = "Current password is required";
    }

    setFieldErrors({
      ...fieldErrors,
      [name]: errorMsg
    });

    return !errorMsg;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate the field when it changes
    if (name === 'newPassword' || name === 'confirmPassword' || name === 'currentPassword') {
      validateField(name, value);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...fieldErrors };

    // Validate current password
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = "Password is required.";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (!newPassword.match(passwordRegex)) {
      newErrors.newPassword = "Password must contain uppercase, lowercase, number, and special character.";
      isValid = false;
    } else if (newPassword.length > 68) {
      newErrors.newPassword = "Password cannot exceed 68 characters.";
      isValid = false;
    }

    // Validate confirm password
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
=======
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
>>>>>>> Stashed changes
  };

  const onSubmit = async (e) => {
    e.preventDefault();

<<<<<<< Updated upstream
    if (!validateForm()) {
=======
    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
>>>>>>> Stashed changes
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in again.');
        return;
      }

      await changePassword(currentPassword, newPassword, token);

      setSuccess('Password changed successfully');
      setError('');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
<<<<<<< Updated upstream
      setFieldErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
=======
>>>>>>> Stashed changes

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Error changing password';
      setError(message);
      setSuccess('');
    }
  };

  return (
    <div className="change-password-container bg-secondary">
      <div className="change-password-card">
        <h2 className="change-password-title">Change Password</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={onChange}
              required
            />
<<<<<<< Updated upstream
            {fieldErrors.currentPassword && (
              <div className="error-message">{fieldErrors.currentPassword}</div>
            )}
=======
>>>>>>> Stashed changes
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={onChange}
              required
            />
<<<<<<< Updated upstream
            {fieldErrors.newPassword && (
              <div className="error-message">{fieldErrors.newPassword}</div>
            )}
=======
>>>>>>> Stashed changes
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
<<<<<<< Updated upstream
            {fieldErrors.confirmPassword && (
              <div className="error-message">{fieldErrors.confirmPassword}</div>
            )}
=======
>>>>>>> Stashed changes
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" className="submit-button">
              Change Password
            </button>
            <button
              type="button"
              className="cancel-button"
              style={{ background: "#ccc", color: "#333" }}
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

<<<<<<< Updated upstream
export default ChangePassword;
=======
export default ChangePassword;
>>>>>>> Stashed changes
