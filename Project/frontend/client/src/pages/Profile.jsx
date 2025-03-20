import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  // State for validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Mock user role (replace with actual role from your authentication system)
  const userRole = "admin"; // Can be "user", "manager", or "admin"

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB.");
        return;
      }
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

    // Validate input on change
    validateField(name, value);
  };

  // Function to validate a specific field
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "Only letters and spaces are allowed.";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Invalid email address.";
        }
        break;

      case "phone":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
          errorMessage = "Phone number must be in the format (555) 123-4567.";
        }
        break;

      default:
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  // Function to validate the entire form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate firstName
    if (!profileInfo.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(profileInfo.firstName)) {
      newErrors.firstName = "Only letters and spaces are allowed.";
      isValid = false;
    }

    // Validate lastName
    if (!profileInfo.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(profileInfo.lastName)) {
      newErrors.lastName = "Only letters and spaces are allowed.";
      isValid = false;
    }

    // Validate email
    if (!profileInfo.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileInfo.email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }

    // Validate phone
    if (!profileInfo.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
      isValid = false;
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(profileInfo.phone)) {
      newErrors.phone = "Phone number must be in the format (555) 123-4567.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Function to save changes
  const saveChanges = () => {
    if (validateForm()) {
      setIsEditing(false);
      console.log("Profile updated:", profileInfo);
    }
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

  return (
    <div className="profile-page">
      {/* Left Side Menu */}
      <div className="left-side-menu">
        <div className="menu-logo">OXY FITNESS</div>
        <nav className="menu-nav">
          <ul>
            {/* Home Button */}
            <li>
              <Link to="/home" className="menu-button">
                <span className="button-icon">🏠</span>
                <span className="button-text">Home</span>
              </Link>
            </li>

            {/* Profile Button */}
            <li>
              <Link to="/profile" className="menu-button">
                <span className="button-icon">👤</span>
                <span className="button-text">Profile</span>
              </Link>
            </li>

            {/* Edit Profile Button */}
            <li>
              <button onClick={toggleEditMode} className="menu-button">
                <span className="button-icon">✏️</span>
                <span className="button-text">Edit Profile</span>
              </button>
            </li>

            {/* Manage Profiles Button (Visible only to managers or admins) */}
            {(userRole === "manager" || userRole === "admin") && (
              <li>
                <Link to="/usermanager" className="menu-button">
                  <span className="button-icon">👥</span>
                  <span className="button-text">Manage Profiles</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

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

          <div className="details-grid">
            {/* First Name */}
            <div className="detail">
              <span className="label">First Name</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={profileInfo.firstName}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName}</span>
                  )}
                </>
              ) : (
                <span className="value">{profileInfo.firstName}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="detail">
              <span className="label">Last Name</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="lastName"
                    value={profileInfo.lastName}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName}</span>
                  )}
                </>
              ) : (
                <span className="value">{profileInfo.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="detail">
              <span className="label">Email</span>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={profileInfo.email}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </>
              ) : (
                <span className="value">{profileInfo.email}</span>
              )}
            </div>

            {/* Phone Number */}
            <div className="detail">
              <span className="label">Phone Number</span>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    name="phone"
                    value={profileInfo.phone}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </>
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
    </div>
  );
};

export default Profile;