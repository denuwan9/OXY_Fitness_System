import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const userService = {
  // Get all members
  getMembers: async () => {
    try {
      const response = await axios.get(`${API_URL}/members`);
      console.log('Members API response:', response.data);
      // Return the members array from the response
      return response.data.members || [];
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  // Get all coaches
  getCoaches: async () => {
    try {
      const response = await axios.get(`${API_URL}/coaches`);
      console.log('Coaches API response:', response.data);
      return response.data.coaches || [];
    } catch (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
  }
};

export default userService; 