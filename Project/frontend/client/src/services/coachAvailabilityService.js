import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/coach-availability`;

const coachAvailabilityService = {
  // Get coach availability
  getCoachAvailability: async (coachId) => {
    console.log('Fetching coach availability for coachId:', coachId);
    try {
      const response = await axios.get(`${API_URL}/${coachId}`);
      console.log('Coach availability response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching coach availability:', error);
      throw error;
    }
  },

  // Update coach availability
  updateAvailability: async (availability, maxMembersPerSession) => {
    console.log('Updating coach availability:', { availability, maxMembersPerSession });
    try {
      const response = await axios.put(API_URL, {
        availability,
        maxMembersPerSession
      });
      console.log('Update availability response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating coach availability:', error);
      throw error;
    }
  },

  // Assign member to coach
  assignMember: async (memberId) => {
    console.log('Assigning member:', memberId);
    try {
      const response = await axios.post(`${API_URL}/assign-member`, {
        memberId
      });
      console.log('Assign member response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error assigning member:', error);
      throw error;
    }
  },

  // Remove member from coach
  removeMember: async (memberId) => {
    console.log('Removing member:', memberId);
    try {
      const response = await axios.delete(`${API_URL}/remove-member/${memberId}`);
      console.log('Remove member response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Get all assigned members
  getAssignedMembers: async () => {
    console.log('Fetching assigned members');
    try {
      const response = await axios.get(`${API_URL}/assigned-members`);
      console.log('Assigned members response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned members:', error);
      throw error;
    }
  }
};

export default coachAvailabilityService; 