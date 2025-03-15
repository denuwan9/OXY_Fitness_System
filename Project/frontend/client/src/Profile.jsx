import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Profile.css"; // Import the CSS file

const Profile = () => {
  // State for the profile picture
  const [avatar, setAvatar] = useState(
    "https://via.placeholder.com/150" // Placeholder image
  );

  // State for editable profile information
  const [profileInfo, setProfileInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main Street",
    city: "New York",
  });

  // State to toggle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for BMI calculation
  const [bmiData, setBmiData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male", // Default gender
  });
  const [bmiResult, setBmiResult] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Function to save changes
  const saveChanges = () => {
    setIsEditing(false);
    // Add logic to save changes (e.g., API call)
    console.log("Profile updated:", profileInfo);
  };

  // Function to handle BMI input changes
  const handleBmiInputChange = (e) => {
    const { name, value } = e.target;
    setBmiData({ ...bmiData, [name]: value });
  };

  // Function to calculate BMI
  const calculateBMI = () => {
    const { height, weight } = bmiData;
    if (height && weight) {
      const heightInMeters = height / 100; // Convert height from cm to meters
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmiResult(bmi);
    } else {
      alert("Please enter both height and weight.");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  return (
    <div className="Profile-page">
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

      {/* Profile Container */}
      <div className="profile-container">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="avatar-container">
            <img src={avatar} alt="Profile" className="avatar" />
            <label htmlFor="avatar-upload" className="camera-icon">
              📷
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <p className="avatar-instruction">
            Click the camera icon to update your avatar
          </p>
        </div>

        {/* Personal Details Section */}
        <div className="personal-details-section">
          <h1>Profile Information</h1>
          <h2>Personal Details</h2>

          {/* Edit Profile Button */}
          <button className="edit-profile-button" onClick={toggleEditMode}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>

          <div className="details-grid">
            {/* First Name */}
            <div className="detail">
              <span className="label">First Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profileInfo.firstName}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="value">{profileInfo.firstName}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="detail">
              <span className="label">Last Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profileInfo.lastName}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="value">{profileInfo.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="detail">
              <span className="label">Email</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileInfo.email}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="value">{profileInfo.email}</span>
              )}
            </div>

            {/* Phone Number */}
            <div className="detail">
              <span className="label">Phone Number</span>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileInfo.phone}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="value">{profileInfo.phone}</span>
              )}
            </div>

            {/* Address */}
            <div className="detail">
              <span className="label">Address</span>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profileInfo.address}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="value">{profileInfo.address}</span>
              )}
            </div>

            {/* City */}
            <div className="detail">
              <span className="label">City</span>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={profileInfo.city}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <span className="value">{profileInfo.city}</span>
              )}
            </div>
          </div>

          {/* Save Changes Button (Visible in Edit Mode) */}
          {isEditing && (
            <button className="save-changes-button" onClick={saveChanges}>
              Save Changes
            </button>
          )}
        </div>

        {/* BMI Calculator Section */}
        <div className="bmi-section">
          <h2>BMI Calculator</h2>
          <div className="bmi-inputs">
            <div className="bmi-input">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={bmiData.height}
                onChange={handleBmiInputChange}
                placeholder="Enter height"
              />
            </div>
            <div className="bmi-input">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={bmiData.weight}
                onChange={handleBmiInputChange}
                placeholder="Enter weight"
              />
            </div>
            <div className="bmi-input">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={bmiData.age}
                onChange={handleBmiInputChange}
                placeholder="Enter age"
              />
            </div>
            <div className="bmi-input">
              <label>Gender</label>
              <select
                name="gender"
                value={bmiData.gender}
                onChange={handleBmiInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <button className="calculate-bmi-button" onClick={calculateBMI}>
            Calculate BMI
          </button>
          {bmiResult && (
            <div className="bmi-result">
              <h3>Your BMI: {bmiResult}</h3>
              <p>
                BMI Categories:
                <br />
                - Underweight: &lt; 18.5
                <br />
                - Normal weight: 18.5–24.9
                <br />
                - Overweight: 25–29.9
                <br />
                - Obesity: ≥ 30
              </p>
            </div>
          )}
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

export default Profile;