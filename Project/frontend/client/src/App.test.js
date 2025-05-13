import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Membership from './pages/Membership';
import reportWebVitals from './pages/reportWebVitals';
import Membership from './pages/Membership';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Membership />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();