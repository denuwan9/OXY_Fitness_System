import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7004/api';

console.log('API_URL:', API_URL); // Log the API URL being used

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
    console.log('Using token:', token); // Log the token being used
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

const scheduleService = {
  // Schedule Management
  createSchedule: async (scheduleData) => {
    try {
      console.log('Creating new schedule:', scheduleData);
      const response = await axiosInstance.post('/schedules', {
        userId: scheduleData.userId,
        coachId: scheduleData.coachId,
        membershipType: scheduleData.membershipType,
        scheduleType: scheduleData.scheduleType,
        sessions: scheduleData.sessions.map(session => ({
          date: session.date,
          time: session.time,
          duration: parseInt(session.duration) || 60,
          workoutType: session.workoutType,
          notes: session.notes || '',
          status: session.status || 'scheduled'
        }))
      });
      console.log('Schedule created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  updateSchedule: async (scheduleId, scheduleData) => {
    try {
      console.log('Updating schedule:', { scheduleId, scheduleData });
      const response = await axiosInstance.put(`/schedules/${scheduleId}`, {
        membershipType: scheduleData.membershipType,
        scheduleType: scheduleData.scheduleType,
        sessions: scheduleData.sessions.map(session => ({
          date: session.date,
          time: session.time,
          duration: parseInt(session.duration) || 60,
          workoutType: session.workoutType,
          notes: session.notes || '',
          status: session.status || 'scheduled'
        }))
      });
      console.log('Schedule updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  generateSchedule: async (data) => {
    const response = await axiosInstance.post('/schedules/generate', data);
    return response.data;
  },

  deleteSchedule: async (scheduleId) => {
    try {
      const response = await axiosInstance.delete(`/schedules/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  // Get user's schedule
  getUserSchedule: async (userId) => {
    try {
      console.log('Fetching schedule for user:', userId);
      const response = await axiosInstance.get(`/schedules/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user schedule:', error);
      throw error;
    }
  },

  requestScheduleChange: async (userId, data) => {
    const response = await axiosInstance.post(`/schedules/change-request/${userId}`, data);
    return response.data;
  },

  approveScheduleChange: async (scheduleId, sessionId) => {
    const response = await axiosInstance.put(`/schedules/approve-change/${scheduleId}/${sessionId}`);
    return response.data;
  },

  rejectScheduleChange: async (scheduleId, sessionId) => {
    try {
      console.log('Rejecting schedule change:', { scheduleId, sessionId });
      const response = await axiosInstance.put(`/schedules/reject-change/${scheduleId}/${sessionId}`);
      console.log('Schedule change rejected successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting schedule change:', error);
      throw error;
    }
  },

  // Exercise Plan Management
  updateExercisePlan: async (data) => {
    const response = await axiosInstance.post('/schedules/exercise-plan', data);
    return response.data;
  },

  getExercisePlan: async (scheduleId, day) => {
    const response = await axiosInstance.get(`/schedules/exercise-plan/${scheduleId}/${day}`);
    return response.data;
  },

  // Meal Plan Management
  assignMealPlan: async (data) => {
    const response = await axiosInstance.post('/schedules/meal-plan', data);
    return response.data;
  },

  // Get meal plan
  getMealPlan: async (scheduleId) => {
    try {
      console.log('Fetching meal plan for schedule:', scheduleId);
      const response = await axiosInstance.get(`/schedules/meal-plan/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      throw error;
    }
  },

  // PDF Report
  downloadScheduleReport: async (userId) => {
    const response = await axiosInstance.get(`/schedules/report/${userId}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'schedule-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Get coach information
  getCoachInfo: async (coachId) => {
    try {
      console.log('Fetching coach info for:', coachId);
      const response = await axiosInstance.get(`/users/${coachId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching coach info:', error);
      throw error;
    }
  },

  // Request reschedule
  requestReschedule: async (data) => {
    try {
      console.log('Sending reschedule request:', data);
      const response = await axiosInstance.post('/schedules/reschedule', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting reschedule:', error);
      throw error;
    }
  },

  // Generate and download report
  generateReport: async (userId) => {
    try {
      console.log('Generating report for user:', userId);
      const response = await axiosInstance.get(`/schedules/report/${userId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Get all change requests
  getChangeRequests: async () => {
    try {
      console.log('Fetching change requests');
      const token = localStorage.getItem('token');
      console.log('Using auth token:', token ? 'Present' : 'Missing');

      const response = await axiosInstance.get('/schedules/change-requests');
      console.log('Change requests response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      // Ensure we always return an array
      const requests = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      console.log('Processed requests:', requests);
      
      return requests;
    } catch (error) {
      console.error('Error fetching change requests:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  },

  // Get all reschedule requests
  getAllRescheduleRequests: async () => {
    try {
      console.log('Fetching all reschedule requests');
      const response = await axiosInstance.get('/schedules/reschedule-requests');
      console.log('Reschedule requests response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reschedule requests:', error);
      throw error;
    }
  }
};

export default scheduleService; 