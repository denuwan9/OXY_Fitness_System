import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [profileImage, setProfileImage] = useState('src/assets/profileimg.png');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    priceStatusChange: false,
    orderDelivered: true,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', { formData, notifications });
  };

  return (
    <div className="settings-page-container">
      <div className="settings-form-section">
        <div className="settings-profile-image-section">
          <img src={profileImage} alt="Profile" className="settings-profile-image" />
          <label htmlFor="profileImageUpload" className="settings-profile-image-label">
            <FaPencilAlt />
          </label>
          <input
            type="file"
            id="profileImageUpload"
            className="settings-profile-image-upload"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <h3>Edit Profile</h3>
        <div className="settings-form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="settings-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="settings-form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="settings-form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
          />
        </div>
        <button className="settings-save-btn" onClick={handleSubmit}>Save</button>
      </div>

      <div className="settings-form-section">
        <h3>Change Password</h3>
        <div className="settings-form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Enter current password"
          />
        </div>
        <div className="settings-form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter new password"
          />
        </div>
        <div className="settings-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
          />
        </div>
        <h3>Notifications</h3>
        <div className="settings-toggle-switch">
          <label>Order Confirmation</label>
          <input
            type="checkbox"
            checked={notifications.orderConfirmation}
            onChange={() => handleToggleChange('orderConfirmation')}
          />
        </div>
        <div className="settings-toggle-switch">
          <label>Price Status Change</label>
          <input
            type="checkbox"
            checked={notifications.priceStatusChange}
            onChange={() => handleToggleChange('priceStatusChange')}
          />
        </div>
        <div className="settings-toggle-switch">
          <label>Order Delivered</label>
          <input
            type="checkbox"
            checked={notifications.orderDelivered}
            onChange={() => handleToggleChange('orderDelivered')}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings; 