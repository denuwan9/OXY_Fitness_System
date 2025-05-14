import React from 'react';
import VitaminCards from '../../components/VitaminCards/VitaminCards';
import './Vitamins.css';

const Vitamins = () => {
  return (
    <div className="vitamins-page">
      <div className="page-header">
        <h1>Vitamins & Supplements</h1>
        <p>Your daily dose of wellness</p>
      </div>
      <VitaminCards />
    </div>
  );
};

export default Vitamins; 