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
  const navigate = useNavigate();

  const { currentPassword, newPassword, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
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

export default ChangePassword;
