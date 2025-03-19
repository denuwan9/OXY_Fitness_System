import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import './Home.css';

const Home = () => {
  return (
    <Layout>
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to OXY FITNESS</h1>
          <p>Transform your life through fitness</p>
          <Link to="/register" className="cta-button">Get Started</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 