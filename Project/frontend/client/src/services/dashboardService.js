import axios from 'axios';

const API_URL = 'http://localhost:6017/api/dashboard';

export const dashboardService = {
  // Get dashboard metrics
  getDashboardMetrics: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }
}; 