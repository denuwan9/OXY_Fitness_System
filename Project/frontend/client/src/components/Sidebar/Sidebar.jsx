import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaTachometerAlt, FaShoppingCart, FaWarehouse, FaStore, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { orderService } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [previousOrdersCount, setPreviousOrdersCount] = useState(0);

  // Function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };                      

  // Check for new orders periodically
  useEffect(() => {
    const checkNewOrders = async () => {
      try {
        const orders = await orderService.getAllOrders();
        if (orders.length > previousOrdersCount) {
          setHasNewOrders(true);
        }
        setPreviousOrdersCount(orders.length);
      } catch (error) {
        console.error('Error checking for new orders:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkNewOrders();
    const interval = setInterval(checkNewOrders, 30000);

    return () => clearInterval(interval);
  }, [previousOrdersCount]);

  // Reset new orders indicator when viewing orders page
  useEffect(() => {
    if (location.pathname === '/orders') {
      setHasNewOrders(false);
    }
  }, [location.pathname]);

  return (
    <div className="side-panel">
      <h2 onClick={() => navigate('/')}>OXY FITNESS</h2>
      <ul>
        <li>
          <Link to="/supplier" className={isActive('/supplier') ? 'active' : ''}>
            <FaTachometerAlt className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
            <FaShoppingCart className="icon" /> Orders
            {hasNewOrders && <span className="new-order-indicator" title="New orders available"></span>}
          </Link>
        </li>
        <li>
          <Link to="/list-items" className={isActive('/list-items') ? 'active' : ''}>
            <FaWarehouse className="icon" /> Inventory
          </Link>
        </li>
        <li>
          <Link to="/selling-items" className={isActive('/selling-items') ? 'active' : ''}>
            <FaStore className="icon" /> Selling Items
          </Link>
        </li>
        <li>
          <Link to="/settings" className={isActive('/settings') ? 'active' : ''}>
            <FaCog className="icon" /> Settings
          </Link>
        </li>
        <li>
          <Link to="/logout" className={isActive('/logout') ? 'active' : ''}>
            <FaSignOutAlt className="icon" /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;