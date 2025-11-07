import React, { useState, useEffect, useRef } from 'react';
import { FaBox, FaExclamationTriangle, FaPlus, FaEdit, FaBoxOpen, FaBell, FaTimes, FaTrash } from 'react-icons/fa';
import { 
  getAllInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem, 
  restockInventoryItem 
} from '../../services/inventoryService';
import './ListItems.css';

const ListItems = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    category: '',
    sku: '',
    currentStock: '',
    minimumStock: '',
    location: '',
    lastRestocked: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const previousStockRef = useRef({});

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getAllInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory data');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a notification
  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  // Check for stock level changes
  useEffect(() => {
    inventory.forEach(item => {
      const previousStock = previousStockRef.current[item._id];
      const isLowStock = item.currentStock <= item.minimumStock;
      const wasLowStock = previousStock && previousStock <= item.minimumStock;

      // Only show notification if stock just became low
      if (isLowStock && !wasLowStock) {
        addNotification(`${item.name} is running low on stock! Current stock: ${item.currentStock}`);
      }

      // Update previous stock reference
      previousStockRef.current[item._id] = item.currentStock;
    });
  }, [inventory]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock':
        return {
          backgroundColor: '#e3f2fd',
          color: '#1976d2'
        };
      case 'Low Stock':
        return {
          backgroundColor: '#fff3e0',
          color: '#f57c00'
        };
      case 'Out of Stock':
        return {
          backgroundColor: '#ffebee',
          color: '#d32f2f'
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          color: '#757575'
        };
    }
  };

  const calculateStatus = (currentStock, minimumStock) => {
    if (currentStock <= 0) return 'Out of Stock';
    if (currentStock <= minimumStock) return 'Low Stock';
    return 'In Stock';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateInventoryItem(currentItem._id, currentItem);
      } else {
        await createInventoryItem(currentItem);
      }
      await fetchInventory();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save inventory item');
      console.error('Error saving inventory item:', err);
    }
  };

  const handleRestock = async (id) => {
    try {
      await restockInventoryItem(id, 10); // Restock with 10 units
      await fetchInventory();
    } catch (err) {
      setError('Failed to restock item');
      console.error('Error restocking item:', err);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id);
        await fetchInventory();
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentItem({
      name: '',
      category: '',
      sku: '',
      currentStock: '',
      minimumStock: '',
      location: '',
      lastRestocked: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItem({
      name: '',
      category: '',
      sku: '',
      currentStock: '',
      minimumStock: '',
      location: '',
      lastRestocked: new Date().toISOString().split('T')[0]
    });
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="inventory-container">
      {/* Notification Container */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className="notification">
            <FaBell className="notification-icon" />
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      <div className="header">
        <div className="header-left">
          <h1>Inventory</h1>
          <p className="header-subtitle">Track and manage your stock levels</p>
        </div>
        <button className="add-stock-btn" onClick={handleAddNew}>
          <FaPlus /> Add New Stock
        </button>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <FaBox className="stat-icon" />
          <div className="stat-info">
            <h3>Total Items</h3>
            <p>{inventory.length}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <FaExclamationTriangle className="stat-icon" />
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p>{inventory.filter(item => item.status === 'Low Stock').length}</p>
          </div>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Minimum Stock</th>
              <th>Location</th>
              <th>Last Restocked</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item._id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.currentStock}</td>
                <td>{item.minimumStock}</td>
                <td>{item.location}</td>
                <td>{new Date(item.lastRestocked).toLocaleDateString()}</td>
                <td>
                  <span 
                    className="inventory-status-badge"
                    style={getStatusStyle(item.status)}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(item)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="restock-btn" onClick={() => handleRestock(item._id)} title="Restock">
                      <FaBoxOpen />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Stock' : 'Add New Stock'}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={currentItem.category}
                    onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={currentItem.sku}
                    onChange={(e) => setCurrentItem({...currentItem, sku: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={currentItem.location}
                    onChange={(e) => setCurrentItem({...currentItem, location: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Current Stock</label>
                  <input
                    type="number"
                    name="currentStock"
                    value={currentItem.currentStock}
                    onChange={(e) => setCurrentItem({...currentItem, currentStock: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Stock</label>
                  <input
                    type="number"
                    name="minimumStock"
                    value={currentItem.minimumStock}
                    onChange={(e) => setCurrentItem({...currentItem, minimumStock: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  {isEditing ? 'Update Stock' : 'Add Stock'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListItems; 