import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  cardHolderName: {
    type: String, 
    required: true
  },
  cardType: {
    type: String, 
    required: true
  },
 
  expiryMonth: {
    type: String, // For decimal or float values
    required: true
  },
  csv: {
    type: String, 
    required: true
  },
  itemname: {
    type: String,  
    required: true
  },
  cardn:{
    type: Number,  
    required: true
  }, 
 
  
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const payment = mongoose.model('paymentt', paymentSchema);

export default payment;
