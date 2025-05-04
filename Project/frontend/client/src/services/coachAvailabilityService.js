import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/coach-availability`;

// Get the authenticated user's ID from the token
const getAuthUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const coachAvailabilityService = {
  // Get coach availability
  getCoachAvailability: async (coachId) => {
    console.log('Fetching coach availability for coachId:', coachId);
    try {
      const response = await axios.get(`${API_URL}/${coachId}`);
      console.log('Coach availability response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Return empty availability object if not found
        return {
          coachId,
          availability: [],
          assignedMembers: []
        };
      }
      console.error('Error fetching coach availability:', error);
      throw error;
    }
  },

  // Update coach availability
  updateAvailability: async (availability) => {
    console.log('Updating coach availability:', { availability });
    try {
      // Format the availability data to match the schema
      const formattedAvailability = availability.map(day => ({
        day: day.day,
        timeRanges: day.timeRanges.map(range => ({
          startTime: range.startTime,
          endTime: range.endTime,
          capacity: range.capacity || 1
        }))
      }));

      const response = await axios.put(API_URL, {
        availability: formattedAvailability
      });
      
      console.log('Update availability response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating coach availability:', error);
      throw error;
    }
  },

  // Assign member to coach
  assignMember: async (memberId, coachId) => {
    try {
      console.log('Assigning member to coach:', { memberId, coachId });
      
      // Validate inputs
      if (!memberId) {
        throw new Error('Member ID is required');
      }
      if (!coachId) {
        throw new Error('Coach ID is required');
      }

      // Ensure IDs are strings
      const memberIdStr = memberId.toString();
      const coachIdStr = coachId.toString();

      // Make the request
      const response = await axios.post(`${API_URL}/assign-member`, {
        memberId: memberIdStr,
        coachId: coachIdStr
      });

      console.log('Member assigned successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error assigning member:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Remove member from coach
  removeMember: async (memberId) => {
    console.log('Removing member:', memberId);
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }
      const response = await axios.delete(`${API_URL}/remove-member/${memberId}`);
      console.log('Remove member response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing member:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Get all assigned members
  getAssignedMembers: async () => {
    console.log('Fetching assigned members');
    try {
      const coachId = getAuthUserId();
      if (!coachId) {
        throw new Error('No coach ID found. Please log in again.');
      }
      const response = await axios.get(`${API_URL}/assigned-members/${coachId}`);
      console.log('Assigned members response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned members:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
};

export default coachAvailabilityService; 