import Order from '../models/orderModel.js';
import { generateOTP } from '../utils/otpGenerator.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      memberId,
      deliveryAddress,
      deliveryCity,
      postalCode,
      customerPhone,
      paymentOption,
      cardNumber,
      expiry,
      cvv,
      product,
      orderTotal,
      deliveryFee
    } = req.body;

    // Generate OTP
    const otpCode = generateOTP();
    const otpCreatedAt = new Date();

    // Create order with OTP (not verified yet)
    const order = new Order({
      orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
      customerName,
      customerEmail,
      memberId,
      deliveryAddress,
      deliveryCity,
      postalCode,
      customerPhone,
      paymentOption,
      cardDetails: paymentOption === 'card' ? {
        cardNumber,
        expiry,
        cvv
      } : undefined,
      products: [{
        productId: product.id,
        name: product.name,
        image: product.image,
        flavor: product.selectedFlavor,
        price: parseFloat(product.newPrice.replace(/[^0-9.]/g, '')),
        quantity: product.quantity
      }],
      orderTotal,
      deliveryFee,
      otp: {
        code: otpCode,
        verified: false,
        createdAt: otpCreatedAt
      }
    });

    const createdOrder = await order.save();

    // In a real app, here you would send the OTP to the customer's phone
    console.log(`OTP for order ${createdOrder.orderNumber}: ${otpCode}`);

    res.status(201).json({
      orderId: createdOrder._id,
      orderNumber: createdOrder.orderNumber,
      otpRequired: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Verify OTP and complete order
// @route   POST /api/orders/verify-otp
// @access  Public
export const verifyOrderOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if OTP matches and is not expired (5 minutes expiration)
    const otpExpirationTime = new Date(order.otp.createdAt.getTime() + 5 * 60 * 1000);
    const currentTime = new Date();

    if (order.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (currentTime > otpExpirationTime) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark OTP as verified
    order.otp.verified = true;
    order.status = 'processing';
    await order.save();

    res.json({
      success: true,
      orderNumber: order.orderNumber,
      message: 'Order confirmed successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Public
export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order fields
    Object.keys(updateData).forEach(key => {
      if (key in order) {
        order[key] = updateData[key];
      }
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating order',
      error: error.message
    });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Public
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching order',
      error: error.message
    });
  }
};