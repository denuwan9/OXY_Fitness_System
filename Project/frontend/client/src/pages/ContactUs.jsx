import { FaPhone, FaHeadset, FaGlobeAmericas } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import "./ContactUs.css"; // Assuming you have a CSS file for styling
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="body5">
    <div className="contact-container">
      <div className="contact-header">
        <h1 >Get in touch</h1>
        <p className="subheading">
          Want to get in touch? We'd love to hear from you. Here's how you can reach us.
        </p>
      </div>

      <div className="contact-options">
        {/* Sales Option */}
        <div className="contact-card">
          <div className="icon-circle sales">
            <FaPhone className="contact-icon" />
          </div>
          <h3>Talk to Membership</h3>
          <p>
            Interested in our gym memberships? Just pick up the phone to chat with a member of our sales team.
          </p>
          <div className="contact-detail">
            <FaPhone className="detail-icon" />
            <span>+94 (074) 051-4795</span>
          </div>
          <Link to="/membership" className="link-text">
            View membership plans →
          </Link>
        </div>

        {/* Support Option */}
        <div className="contact-card">
          <div className="icon-circle support">
            <FaHeadset className="contact-icon" />
          </div>
          <h3>Member Support</h3>
          <p>
            Need help with your account or have questions? Our support team is here for you.
          </p>
          <div className="contact-detail">
            <FaPhone className="detail-icon" />
            <span>+94 (074) 051-4795</span>
          </div>
          <div className="contact-detail">
            <MdEmail className="detail-icon" />
            <span>oxifitness01@gmail.com</span>
          </div>
        </div>

        {/* Locations Option */}
        <div className="contact-card">
          <div className="icon-circle locations">
            <FaGlobeAmericas className="contact-icon" />
          </div>
          <h3>Our Locations</h3>
          <p>
            Visit our Oxi Fitness Gym facilities near you.
          </p>
          <div className="location-details">
            <div className="location">
              <h4>Kadawatha</h4>
              <p>Oxi Fitness Center, Kadawatha</p>
              <p>Mon-Fri: 5AM-11PM</p>
            </div>
            <div className="location">
              <h4>Kandy Rd</h4>
              <p>Oxi Fitness Center 134/17/1, Kandy Rd</p>
              <p>Mon-Fri: 5AM-11PM</p>
            </div>
            
          </div>
          <a href="https://maps.app.goo.gl/KbDKG8xEhrvqDYPV7" className="link-text">
            View all locations →
          </a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactUs;