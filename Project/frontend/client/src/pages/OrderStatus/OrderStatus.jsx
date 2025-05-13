import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderStatus.css';

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};
  const [orderStatus, setOrderStatus] = useState(orderDetails?.status || 'pending');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliveryAgent, setDeliveryAgent] = useState('');
  const [agentContact, setAgentContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchOrderStatus = async () => {
    if (!orderDetails?._id) {
      console.error('No order ID available');
      return;
    }

    try {
      console.log('Fetching status for order ID:', orderDetails._id);
      const response = await fetch(`http://localhost:4000/api/orders/${orderDetails._id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received order data:', data);
      
      // Update the status and last updated time
      if (data.status) {
        console.log('Updating status to:', data.status);
        setOrderStatus(data.status);
        setLastUpdated(new Date());
        setError(null);

        // Update estimated delivery based on status
        if (data.status === 'processing') {
          setEstimatedDelivery(getFutureDate(3));
        } else if (data.status === 'shipped') {
          setEstimatedDelivery(getFutureDate(1));
        }
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      setError('Failed to fetch order status. Please try again later.');
    }
  };

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
      return;
    }

    // Generate tracking info
    setTrackingNumber(`TRK-${Math.floor(Math.random() * 1000000)}`);
    setDeliveryAgent('Speedy Delivery Express');
    setAgentContact('+94 76 123 4567');

    // Initial fetch
    fetchOrderStatus();

    // Poll for updates every 5 seconds
    const pollInterval = setInterval(fetchOrderStatus, 5000);

    return () => clearInterval(pollInterval);
  }, [orderDetails, navigate]);

  const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!orderDetails) {
    return (
      <div className="order-status-container">
        <div className="no-order-found">
          <h2>No Order Found</h2>
          <p>Please check your order history or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-status-container">
      <div className="order-status-header">
        <h1>Order #{orderDetails.orderNumber}</h1>
        <p className="order-date">
          Ordered on {new Date(orderDetails.orderDate).toLocaleDateString()}
        </p>
      </div>

      <div className="status-timeline" data-status={orderStatus}>
        <div 
          className={`timeline-step ${orderStatus !== 'pending' ? 'completed' : ''} ${orderStatus === 'pending' ? 'current' : ''}`}
        >
          <div className="step-icon">1</div>
          <div className="step-label">Order Placed</div>
        </div>
        <div 
          className={`timeline-step ${orderStatus === 'processing' ? 'current' : ''} ${['shipped', 'delivered'].includes(orderStatus) ? 'completed' : ''}`}
        >
          <div className="step-icon">2</div>
          <div className="step-label">Processing</div>
        </div>
        <div 
          className={`timeline-step ${orderStatus === 'shipped' ? 'current' : ''} ${orderStatus === 'delivered' ? 'completed' : ''}`}
        >
          <div className="step-icon">3</div>
          <div className="step-label">Shipped</div>
        </div>
        <div 
          className={`timeline-step ${orderStatus === 'delivered' ? 'completed current' : ''}`}
        >
          <div className="step-icon">4</div>
          <div className="step-label">Delivered</div>
        </div>
      </div>

      <div className="current-status">
        <h2>Current Status: {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}</h2>
        <p className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
          {isLoading && <span className="updating-indicator"> (Updating...)</span>}
        </p>
        {error && <p className="error-message">{error}</p>}
        {orderStatus === 'pending' && (
          <p>Your order has been received and is awaiting processing.</p>
        )}
        {orderStatus === 'processing' && estimatedDelivery && (
          <p>Estimated Delivery: {estimatedDelivery}</p>
        )}
        {['shipped', 'delivered'].includes(orderStatus) && trackingNumber && (
          <div className="tracking-info">
            <p>Tracking Number: {trackingNumber}</p>
            <p>Delivery Partner: {deliveryAgent}</p>
            <p>Contact: {agentContact}</p>
            {orderStatus === 'shipped' && estimatedDelivery && (
              <p>Estimated Delivery: {estimatedDelivery}</p>
            )}
          </div>
        )}
        {orderStatus === 'delivered' && (
          <div className="delivery-confirmation">
            <p>Your order has been successfully delivered!</p>
            <p>Delivered on: {new Date().toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="product-item">
          <img src={orderDetails.product.image} alt={orderDetails.product.name} />
          <div className="product-info">
            <h3>{orderDetails.product.name}</h3>
            <p>Flavor: {orderDetails.product.selectedFlavor}</p>
            <p>Quantity: {orderDetails.product.quantity}</p>
          </div>
          <div className="product-price">
            LKR {orderDetails.product.priceValue?.toLocaleString('en-US')}
          </div>
        </div>
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal</span>
            <span>LKR {(orderDetails.product.priceValue * orderDetails.product.quantity).toLocaleString('en-US')}</span>
          </div>
          <div className="price-row">
            <span>Delivery</span>
            <span>LKR {orderDetails.deliveryFee.toLocaleString('en-US')}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>LKR {orderDetails.orderTotal.toLocaleString('en-US')}</span>
          </div>
        </div>
      </div>

      <div className="customer-info">
        <h2>Delivery Information</h2>
        <div className="info-card">
          <p><strong>{orderDetails.customerName}</strong></p>
          <p>{orderDetails.deliveryAddress}</p>
          <p>{orderDetails.deliveryCity}, {orderDetails.postalCode}</p>
          <p>Sri Lanka</p>
          <p>Phone: {orderDetails.customerPhone}</p>
          <p>Email: {orderDetails.customerEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;