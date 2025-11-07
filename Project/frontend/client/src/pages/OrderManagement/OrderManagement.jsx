import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaTruck, FaCheckCircle, FaSync, FaCreditCard, FaHome, FaUser, FaBox, FaTimes, FaEye, FaSearch } from 'react-icons/fa';
import { orderService } from '../../services/orderService';
import './OrderManagement.css';

// Sample data for development
const sampleOrders = [
  {
    _id: "1",
    orderNumber: "ORD-362397",
    customerName: "Sandun Wickramasinghe",
    customerEmail: "SandunWicky143@gmail.com",
    memberId: "OXY234",
    deliveryAddress: "No. 42, Temple Road, Nugegoda",
    deliveryCity: "Colombo",
    postalCode: "00300",
    customerPhone: "0761007873",
    paymentOption: "card",
    status: "processing",
    products: [
      {
        productId: "11",
        name: "Applied Nutrition Whey Protein",
        image: "/src/assets/p2.png",
        flavor: "Chocolate",
        price: 21750,
        quantity: 1,
        _id: "67ea4cc4cddfa1cd5bd9f51f"
      }
    ],
    orderTotal: 21750,
    deliveryFee: 0,
    createdAt: new Date().toISOString()
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const previousOrdersCount = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch orders on component mount only
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      
      // Check for new orders
      if (data.length > previousOrdersCount.current) {
        setHasNewOrders(true);
      }
      
      previousOrdersCount.current = data.length;
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders from backend.');
    } finally {
      setLoading(false);
    }
  };

  // Reset new orders indicator when viewing orders
  useEffect(() => {
    if (showDetailModal) {
      setHasNewOrders(false);
    }
  }, [showDetailModal]);

  // Add search effect
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderTotal.toString().includes(searchTerm)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge pending',
      processing: 'status-badge processing',
      shipped: 'status-badge shipped',
      delivered: 'status-badge delivered',
      cancelled: 'status-badge cancelled'
    };

    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Initialize edit form data when opening modal
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditFormData({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      memberId: order.memberId,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      postalCode: order.postalCode,
      customerPhone: order.customerPhone,
      paymentOption: order.paymentOption,
      deliveryFee: order.deliveryFee
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Make API call to update status
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      
      // Update the selected order in the modal
      setSelectedOrder(prevOrder => ({
        ...prevOrder,
        status: newStatus
      }));
      
      // Update in the orders array
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show success notification
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleDelete = async (orderId) => {
    if(window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(orderId);
        await fetchOrders(); // Refresh orders list
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await orderService.updateOrder(selectedOrder._id, editFormData);
      setShowEditModal(false);
      await fetchOrders(); // Refresh orders list
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchOrders();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000); // Minimum 1 second of animation
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!selectedOrder) return <div className="no-orders-container">No orders found</div>;

  return (
    <div className="order-management-container">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="orders-header-right">
          <div className="order-search-container">
            <FaSearch className="order-search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="order-search-input"
            />
          </div>
          <button 
            className={`refresh-btn ${isRefreshing ? 'loading' : ''}`} 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FaSync />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="order-id">{order.orderNumber}</td>
                <td className="customer-info">
                  <div className="customer-name">{order.customerName}</div>
                  <div className="customer-email">{order.customerEmail}</div>
                </td>
                <td className="order-date">{formatDate(order.createdAt)}</td>
                <td className="order-total">LKR {order.orderTotal.toLocaleString()}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleViewDetails(order)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="order-details-view">
              <div className="order-header">
                <div className="header-left">
                  <h1 className="order-title">Order #{selectedOrder.orderNumber}</h1>
                  <div className="order-meta">
                    <span className="order-date">Placed on: {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="header-right">
                  <div className={`order-status-badge ${selectedOrder.status}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </div>
                  <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="order-dashboard">
                {/* Left Column */}
                <div className="order-details-column">
                  {/* Customer Information Card */}
                  <div className="info-card customer-card">
                    <div className="card-header">
                      <FaUser className="card-icon" />
                      <h3>Customer Information</h3>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{selectedOrder.customerName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{selectedOrder.customerEmail}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{selectedOrder.customerPhone}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Member ID:</span>
                        <span className="info-value">{selectedOrder.memberId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information Card */}
                  <div className="info-card shipping-card">
                    <div className="card-header">
                      <FaHome className="card-icon" />
                      <h3>Shipping Information</h3>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span className="info-label">Address:</span>
                        <span className="info-value">{selectedOrder.deliveryAddress}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">City:</span>
                        <span className="info-value">{selectedOrder.deliveryCity}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Postal Code:</span>
                        <span className="info-value">{selectedOrder.postalCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information Card */}
                  <div className="info-card payment-card">
                    <div className="card-header">
                      <FaCreditCard className="card-icon" />
                      <h3>Payment Information</h3>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span className="info-label">Method:</span>
                        <span className="info-value">
                          {selectedOrder.paymentOption === 'card' ? 'Credit/Debit Card' : selectedOrder.paymentOption}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Order Total:</span>
                        <span className="info-value">LKR {selectedOrder.orderTotal.toLocaleString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Delivery Fee:</span>
                        <span className="info-value">LKR {selectedOrder.deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="info-row total-row">
                        <span className="info-label">Amount Paid:</span>
                        <span className="info-value">LKR {(selectedOrder.orderTotal + selectedOrder.deliveryFee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="order-actions-column">
                  {/* Order Items Card */}
                  <div className="info-card items-card">
                    <div className="card-header">
                      <FaBox className="card-icon" />
                      <h3>Order Items</h3>
                    </div>
                    <div className="card-body">
                      {selectedOrder.products.map((product) => (
                        <div key={product._id} className="order-item">
                          <div className="item-image">
                            <img src={product.image || '/placeholder-product.png'} alt={product.name} />
                          </div>
                          <div className="item-details">
                            <h4 className="item-name">{product.name}</h4>
                            <div className="item-meta">
                              <span className="item-flavor">Flavor: {product.flavor}</span>
                              <span className="item-quantity">Qty: {product.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>LKR {selectedOrder.orderTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                          <span>Delivery Fee:</span>
                          <span>LKR {selectedOrder.deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>LKR {(selectedOrder.orderTotal + selectedOrder.deliveryFee).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions Card */}
                  <div className="info-card actions-card">
                    <div className="card-header">
                      <h3>Order Actions</h3>
                    </div>
                    <div className="card-body">
                      <div className="status-actions">
                        <h4>Update Status</h4>
                        <div className="status-buttons">
                          <button 
                            className={`status-btn processing ${selectedOrder.status === 'processing' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(selectedOrder._id, 'processing')}
                          >
                            <FaSync className="status-icon" /> Processing
                          </button>
                          <button 
                            className={`status-btn shipped ${selectedOrder.status === 'shipped' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(selectedOrder._id, 'shipped')}
                          >
                            <FaTruck className="status-icon" /> Shipped
                          </button>
                          <button 
                            className={`status-btn delivered ${selectedOrder.status === 'delivered' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(selectedOrder._id, 'delivered')}
                          >
                            <FaCheckCircle className="status-icon" /> Delivered
                          </button>
                        </div>
                      </div>

                      <div className="management-actions">
                        <h4>Order Management</h4>
                        <div className="action-buttons">
                          <button className="edit-btn-n" onClick={() => handleEdit(selectedOrder)}>
                            <FaEdit /> Edit Order
                          </button>
                          <button className="delete-btn-n" onClick={() => handleDelete(selectedOrder._id)}>
                            <FaTrash /> Delete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="order-edit-modal-overlay">
          <div className="order-edit-modal">
            <div className="modal-header">
              <h2>Edit Order #{selectedOrder.orderNumber}</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="edit-form-section">
                <h3 className="section-title">Customer Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={editFormData.customerName}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={editFormData.customerEmail}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={editFormData.customerPhone}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Member ID</label>
                    <input
                      type="text"
                      name="memberId"
                      value={editFormData.memberId}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-section">
                <h3 className="section-title">Shipping Details</h3>
                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea
                    name="deliveryAddress"
                    value={editFormData.deliveryAddress}
                    onChange={handleFormChange}
                    className="form-input address-input"
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="deliveryCity"
                      value={editFormData.deliveryCity}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={editFormData.postalCode}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-section">
                <h3 className="section-title">Payment Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      name="paymentOption"
                      value={editFormData.paymentOption}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="cash">Cash on Delivery</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Delivery Fee (LKR)</label>
                    <input
                      type="number"
                      name="deliveryFee"
                      value={editFormData.deliveryFee}
                      onChange={handleFormChange}
                      className="form-input"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-save-btn" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;