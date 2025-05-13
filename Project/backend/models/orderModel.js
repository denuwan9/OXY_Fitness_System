import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  memberId: {
    type: String,
    default: ''
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryCity: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  paymentOption: {
    type: String,
    required: true,
    enum: ['card', 'helapay']
  },
  cardDetails: {
    cardNumber: String,
    expiry: String,
    cvv: String
  },
  products: [{
    productId: String,
    name: String,
    image: String,
    flavor: String,
    price: Number,
    quantity: Number
  }],
  orderTotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  otp: {
    code: String,
    verified: Boolean,
    createdAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;