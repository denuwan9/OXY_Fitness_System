import React, { useState, useRef } from 'react';
import Layout from '../components/layout/Layout';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Fitness Street, Gym City',
    membershipType: 'Premium',
    membershipExpiry: '2024-12-31',
    profileImage: '/images/profileimg.png'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // BMI Calculator state
  const [bmiData, setBmiData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male'
  });

  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBmiChange = (e) => {
    const { name, value } = e.target;
    setBmiData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData(prevState => ({
          ...prevState,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height) / 100; // Convert cm to meters
    const age = parseInt(bmiData.age);

    if (weight && height && age) {
      const bmi = weight / (height * height);
      setBmiResult(bmi.toFixed(1));

      // Determine BMI category and color
      let category = '';
      let color = '';
      if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3498db';
      } else if (bmi < 25) {
        category = 'Normal Weight';
        color = '#2ecc71';
      } else if (bmi < 30) {
        category = 'Overweight';
        color = '#f1c40f';
      } else {
        category = 'Obese';
        color = '#e74c3c';
      }
      setBmiCategory(category);
      setBmiColor(color);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to update the profile
      console.log('Profile data to update:', profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-image-container">
              <img 
                src={previewImage || profileData.profileImage} 
                alt="Profile" 
                className="profile-image" 
              />
              {isEditing && (
                <label className="change-photo-btn">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h2>{profileData.name}</h2>
              <p>{profileData.membershipType} Member</p>
              <p>Member since: January 2024</p>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="profile-section">
                  <h3>Membership Details</h3>
                  <div className="membership-info">
                    <div className="info-item">
                      <label>Membership Type</label>
                      <p>{profileData.membershipType}</p>
                    </div>
                    <div className="info-item">
                      <label>Expiry Date</label>
                      <p>{profileData.membershipExpiry}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>BMI Calculator</h3>
                  <form onSubmit={calculateBMI}>
                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={bmiData.weight}
                        onChange={handleBmiChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={bmiData.height}
                        onChange={handleBmiChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        name="age"
                        value={bmiData.age}
                        onChange={handleBmiChange}
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <div className="gender-options">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={bmiData.gender === 'male'}
                            onChange={handleBmiChange}
                          />
                          Male
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={bmiData.gender === 'female'}
                            onChange={handleBmiChange}
                          />
                          Female
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="calculate-btn">Calculate BMI</button>
                  </form>

                  {bmiResult && (
                    <div className="bmi-result" style={{ borderColor: bmiColor }}>
                      <h3>Your BMI Result</h3>
                      <div className="bmi-value" style={{ color: bmiColor }}>
                        {bmiResult}
                      </div>
                      <div className="bmi-category" style={{ color: bmiColor }}>
                        {bmiCategory}
                      </div>
                    </div>
                  )}

                  <div className="bmi-info">
                    <h3>BMI Categories</h3>
                    <ul>
                      <li><span className="category-color" style={{ backgroundColor: '#3498db' }}></span> Underweight: &lt; 18.5</li>
                      <li><span className="category-color" style={{ backgroundColor: '#2ecc71' }}></span> Normal Weight: 18.5 - 24.9</li>
                      <li><span className="category-color" style={{ backgroundColor: '#f1c40f' }}></span> Overweight: 25 - 29.9</li>
                      <li><span className="category-color" style={{ backgroundColor: '#e74c3c' }}></span> Obese: ≥ 30</li>
                    </ul>
                  </div>
                </div>

                <div className="profile-actions">
                  {isEditing ? (
                    <>
                      <button type="submit" className="save-btn">Save Changes</button>
                      <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 