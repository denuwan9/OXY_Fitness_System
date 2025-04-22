import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.css";
import { post, put } from '../services/ApiEndpoint';
import { Logout, updateUser } from "../redux/AuthSlice";
import axios from "axios";




const Profile = () => {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for the profile picture
  const [avatar, setAvatar] = useState(
    user?.profilePicture || "https://placekitten.com/150/150" // Placeholder image
  );

  // State for editable profile information
  const [profileInfo, setProfileInfo] = useState({
    firstName: user?.fname || "",
    lastName: user?.lname || "",
    email: user?.email || "",
    phone: user?.number || "",
    address: user?.address || "",
    city: user?.city || "",
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

  // Update profileInfo when user data changes
  useEffect(() => {
    if (user) {
      setProfileInfo({
        firstName: user.fname || "",
        lastName: user.lname || "",
        email: user.email || "",
        phone: user.number || "",
        address: user.address || "",
        city: user.city || "",
      });
      setAvatar(user.profilePicture || "https://placekitten.com/150/150");
    }
  }, [user]);

  // Function to handle avatar upload
  const handleAvatarUpload = async (e) => {
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
        const imageUrl = reader.result;
        setAvatar(imageUrl);
        
        // Update the user's profile picture in the backend
        if (user) {
          const updatedUser = { ...user, profilePicture: imageUrl };
          dispatch(updateUser(updatedUser));
          
          // Here you would typically make an API call to save the image to the backend
          // For example:
          // post('/api/user/update-profile-picture', { image: imageUrl });
        }
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
        } else if ( !/^\+?[0-9\s\-\(\)]{8,20}$/.test(value)) {
          errorMessage = "Please enter a valid phone number (e.g., +1234567890).";
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
    } else if (! /^\+?[0-9\s\-\(\)]{8,20}$/.test(profileInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., +1234567890).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Admin button navigation
  const goToAdmin = () => {
    navigate("/admin");
  };

  // Logout button function
  const handleLogout = async () => {
    try {
      const response = await post("/api/auth/logout");
      if (response.status === 200) {
        dispatch(Logout());
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  // Function to save changes
  const saveChanges = async () => {
    if (!validateForm()) {
      alert('Please fix the validation errors before saving.');
      return;
    }
  
    try {
      const id = user?.id || user?._id;
      if (!id) {
        throw new Error('User ID is not available.');
      }
  
      const updatedUser = {
        fname: profileInfo.firstName,
        lname: profileInfo.lastName,
        email: profileInfo.email,
        number: profileInfo.phone,
        address: profileInfo.address,
        city: profileInfo.city,
        profilePicture: avatar // Make sure to include the avatar
      };
  
      // Send update request to backend
      const response = await axios.put(
        `http://localhost:6017/api/auth/userUpdate/${id}`,
        updatedUser,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      // Check if response contains updated user data
      if (response.data && response.data.user) {
        // Dispatch the update action with the complete user data
        dispatch(updateUser(response.data.user));
        
        // Update local state with the new data
        setProfileInfo({
          firstName: response.data.user.fname || "",
          lastName: response.data.user.lname || "",
          email: response.data.user.email || "",
          phone: response.data.user.number || "",
          address: response.data.user.address || "",
          city: response.data.user.city || "",
        });
        
        if (response.data.user.profilePicture) {
          setAvatar(response.data.user.profilePicture);
        }
  
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile';
      alert(errorMessage);
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
              <Link to="/" className="menu-button">
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
                <span className="button-text">
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </span>
              </button>
            </li>

            {/* Manage Profiles Button (Visible only for admins) */}
            <li>
              {user && user.role === "admin" ? (
                <button className="menu-button" onClick={goToAdmin}>
                  <span className="button-icon">👥</span>
                  <span className="button-text">Manage Profiles</span>
                </button>
              ) : null}
            </li>

            {/* Logout Button */}
            <li>
              <button onClick={handleLogout} className="menu-button">
                <span className="button-icon">🚪</span>
                <span className="button-text">Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Profile Container */}
      <div className="profile-container">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="avatar-container">
            
          </div>
          
        </div>
        
        <div className="user-card">
          <h2>Welcome, {profileInfo.firstName}</h2>
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
                    className={`edit-input ${errors.firstName ? "error" : ""}`}
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
                    className={`edit-input ${errors.lastName ? "error" : ""}`}
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
                    className={`edit-input ${errors.email ? "error" : ""}`}
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
                    className={`edit-input ${errors.phone ? "error" : ""}`}
                    placeholder="(012) 123-4567"
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
            <div className="edit-actions">
              <button className="save-changes-button" onClick={saveChanges}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={toggleEditMode}>
                Cancel
              </button>
            </div>
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