import Order from '../models/Order.js';
import Product from '../models/Product.js';

const getDashboardMetrics = async (req, res) => {
  try {
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Get completed orders count
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    // Calculate total revenue
    const completedOrdersData = await Order.find({ status: 'completed' });
    const revenue = completedOrdersData.reduce((total, order) => total + order.totalAmount, 0);
    
    // Calculate total withdrawals
    const withdrawals = completedOrdersData.reduce((total, order) => total + (order.totalAmount * 0.8), 0);
    
    // Get available stocks
    const products = await Product.find();
    const availableStocks = products.reduce((total, product) => total + product.stock, 0);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue,
      withdrawals,
      availableStocks
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

// Named export
export { getDashboardMetrics };

// Alternative default export (choose one)
// export default { getDashboardMetrics };