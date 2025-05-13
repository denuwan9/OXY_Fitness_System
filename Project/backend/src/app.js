const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const { Db } = require('mongodb');
const DbCon = require('./utlis/db.js');
const membershipRoutes = require('./routes/membershipRoutes');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
DbCon()


// Routes

//Danidu
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);

//Anushika
app.use('/api/memberships', membershipRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'OXY Fitness API is running' 
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

module.exports = app;