import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header>
      <div className="logo">OXY FITNESS</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/coaches">Coaches</Link></li>
          <li><Link to="/programs">Programs</Link></li>
          <li><Link to="/memberships">Memberships</Link></li>
          <li><Link to="/contacts">Contacts</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </nav>
      <div className="user-profile">
        <img src="/images/bell.png" alt="Bell Icon" className="bell-icon" /> 
        <img
          src="/images/profileimg.png" 
          alt="Profile"
          className="profile-img"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
};

export default Header; 