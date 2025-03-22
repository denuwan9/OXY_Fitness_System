import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const userService = {
  // Get all members
  getMembers: async () => {
    try {
      const response = await axios.get(`${API_URL}/members`);
      return response.data.members;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }
};

export default userService; 