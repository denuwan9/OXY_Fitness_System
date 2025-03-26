import axios from 'axios';

const API_URL = '/api/schedules';

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const scheduleService = {
  // Schedule Management
  generateSchedule: async (data) => {
    const response = await axiosInstance.post('/generate', data);
    return response.data;
  },

  saveSchedule: async (scheduleData) => {
    try {
      // If scheduleData has an _id, it's an update
      if (scheduleData._id) {
        const response = await axiosInstance.put(`/${scheduleData._id}`, scheduleData);
        return response.data;
      } else {
        // If no _id, it's a new schedule
        const response = await axiosInstance.post('/', scheduleData);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  },

  deleteSchedule: async (scheduleId) => {
    try {
      const response = await axiosInstance.delete(`/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  getUserSchedule: async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      console.log('User schedule response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user schedule:', error);
      throw error;
    }
  },

  requestScheduleChange: async (userId, data) => {
    const response = await axiosInstance.post(`/change-request/${userId}`, data);
    return response.data;
  },

  approveScheduleChange: async (scheduleId, sessionId) => {
    const response = await axiosInstance.put(`/approve-change/${scheduleId}/${sessionId}`);
    return response.data;
  },

  // Exercise Plan Management
  updateExercisePlan: async (data) => {
    const response = await axiosInstance.post('/exercise-plan', data);
    return response.data;
  },

  getExercisePlan: async (scheduleId, day) => {
    const response = await axiosInstance.get(`/exercise-plan/${scheduleId}/${day}`);
    return response.data;
  },

  // Meal Plan Management
  assignMealPlan: async (data) => {
    const response = await axiosInstance.post('/meal-plan', data);
    return response.data;
  },

  getMealPlan: async (scheduleId) => {
    const response = await axiosInstance.get(`/meal-plan/${scheduleId}`);
    return response.data;
  },

  // PDF Report
  downloadScheduleReport: async (userId) => {
    const response = await axiosInstance.get(`/report/${userId}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'schedule-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export default scheduleService; 