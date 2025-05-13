import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaClock, FaCheckCircle, FaChartLine, FaWallet, FaBoxes, FaSearch } from 'react-icons/fa';
import './SupplierDashboard.css'; // This will now contain all the CSS
import profileImg from '../../assets/profileimg.png';
import { jsPDF } from 'jspdf';
import { orderService } from '../../services/orderService';
import { getAllInventory } from '../../services/inventoryService';
import { useSelector } from 'react-redux';

const SupplierDashboard = () => {
  const user = useSelector((state) => state.Auth.user);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    withdrawals: 0,
    availableStocks: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMetrics, setFilteredMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const orders = await orderService.getAllOrders();
        
        // Calculate metrics
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => 
          order.status === 'pending' || order.status === 'processing'
        ).length;
        const completedOrders = orders.filter(order => 
          order.status === 'delivered'
        ).length;
        const revenue = orders.reduce((total, order) => {
          if (order.status !== 'cancelled') {
            return total + (order.orderTotal || 0);
          }
          return total;
        }, 0);

        // Fetch inventory data
        const inventory = await getAllInventory();
        const totalStocks = inventory.reduce((total, item) => total + item.currentStock, 0);
        
        const newMetrics = {
          totalOrders,
          pendingOrders,
          completedOrders,
          revenue,
          withdrawals: 50000,
          availableStocks: totalStocks
        };
        
        setMetrics(newMetrics);
        const withdrawalsValue = 50000;
        setFilteredMetrics([
          { title: 'Total Orders', value: totalOrders, icon: <FaShoppingCart />, period: 'March 2025' },
          { title: 'Pending Orders', value: pendingOrders, icon: <FaClock />, period: 'Last 5 Days' },
          { title: 'Completed Orders', value: completedOrders, icon: <FaCheckCircle />, period: 'March 2025' },
          { title: 'Revenue', value: 'LKR ' + revenue.toLocaleString(), icon: <FaChartLine />, period: 'This Month' },
          { title: 'Withdrawals', value: 'LKR ' + withdrawalsValue.toLocaleString(), icon: <FaWallet />, period: 'This Month' },
          { title: 'Available Stocks', value: totalStocks, icon: <FaBoxes />, period: 'This Month' }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter metrics based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMetrics([
        { title: 'Total Orders', value: metrics.totalOrders, icon: <FaShoppingCart />, period: 'March 2025' },
        { title: 'Pending Orders', value: metrics.pendingOrders, icon: <FaClock />, period: 'Last 5 Days' },
        { title: 'Completed Orders', value: metrics.completedOrders, icon: <FaCheckCircle />, period: 'March 2025' },
        { title: 'Revenue', value: 'LKR ' + metrics.revenue.toLocaleString(), icon: <FaChartLine />, period: 'This Month' },
        { title: 'Withdrawals', value: 'LKR ' + metrics.withdrawals.toLocaleString(), icon: <FaWallet />, period: 'This Month' },
        { title: 'Available Stocks', value: metrics.availableStocks, icon: <FaBoxes />, period: 'This Month' }
      ]);
    } else {
      const filtered = [
        { title: 'Total Orders', value: metrics.totalOrders, icon: <FaShoppingCart />, period: 'March 2025' },
        { title: 'Pending Orders', value: metrics.pendingOrders, icon: <FaClock />, period: 'Last 5 Days' },
        { title: 'Completed Orders', value: metrics.completedOrders, icon: <FaCheckCircle />, period: 'March 2025' },
        { title: 'Revenue', value: 'LKR ' + metrics.revenue.toLocaleString(), icon: <FaChartLine />, period: 'This Month' },
        { title: 'Withdrawals', value: 'LKR ' + metrics.withdrawals.toLocaleString(), icon: <FaWallet />, period: 'This Month' },
        { title: 'Available Stocks', value: metrics.availableStocks, icon: <FaBoxes />, period: 'This Month' }
      ].filter(metric => 
        metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.value.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.period.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMetrics(filtered);
    }
  }, [searchTerm, metrics]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Supplier Dashboard Report', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(12);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 30, { align: 'center' });
    
    // Add supplier information
    doc.setFontSize(14);
    doc.text('Supplier: Nalaka A.S.R.K', 14, 45);
    
    // Create table headers
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Metric', 20, 60);
    doc.text('Value', 80, 60);
    doc.text('Time Period', 140, 60);
    
    // Add horizontal line
    doc.line(20, 65, 190, 65);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Table data
    const data = [
      { metric: 'Total Orders', value: metrics.totalOrders.toString(), period: 'March 2025' },
      { metric: 'Pending Orders', value: metrics.pendingOrders.toString(), period: 'Last 5 Days' },
      { metric: 'Completed Orders', value: metrics.completedOrders.toString(), period: 'March 2025' },
      { metric: 'Revenue', value: 'LKR ' + metrics.revenue.toLocaleString(), period: 'This Month' },
      { metric: 'Withdrawals', value: 'LKR ' + metrics.withdrawals.toLocaleString(), period: 'This Month' },
      { metric: 'Available Stocks', value: metrics.availableStocks.toString(), period: 'This Month' }
    ];
    
    // Add table rows
    data.forEach((row, index) => {
      const y = 75 + (index * 10);
      doc.text(row.metric, 20, y);
      doc.text(row.value, 80, y);
      doc.text(row.period, 140, y);
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('© 2025 Supplier Dashboard System', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save('supplier-dashboard-report.pdf');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-profile">
          <img src={profileImg} alt="Profile" className="dashboard-profile-img" />
          <div className="dashboard-profile-info">
            <h1 className="dashboard-title">Welcome, <span className="dashboard-username">{user?.fname}</span></h1>
            <p className="dashboard-subtitle">Supplier Dashboard</p>
          </div>
        </div>
        
        <div className="dashboard-search">
          <input 
            type="text" 
            placeholder="Search metrics..." 
            className="dashboard-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="dashboard-search-btn"><FaSearch /></button>
        </div>
      </div>

      {/* Download Report Button */}
      <button className="dashboard-report-btn" onClick={generatePDF}>Download Report</button>

      {/* Dashboard Metrics */}
      <div className="dashboard-metrics">
        {filteredMetrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <div className="metric-icon">{metric.icon}</div>
            <h3 className="metric-title">{metric.title}</h3>
            <p className="metric-value">{metric.value}</p>
            <span className="metric-period">{metric.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDashboard;