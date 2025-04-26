import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const exerciseService = {
  // Get all exercises
  getAllExercises: async () => {
    const response = await axios.get(`${API_URL}/exercises`);
    return response.data;
  },

  // Get exercises by instructor
  getInstructorExercises: async () => {
    const response = await axios.get(`${API_URL}/exercises/instructor`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Get exercises assigned to a member
  getMemberExercises: async (memberId) => {
    const response = await axios.get(`${API_URL}/exercises/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Create a new exercise
  createExercise: async (exerciseData) => {
    const response = await axios.post(`${API_URL}/exercises`, exerciseData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Update an exercise
  updateExercise: async (id, exerciseData) => {
    const response = await axios.put(`${API_URL}/exercises/${id}`, exerciseData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Delete an exercise
  deleteExercise: async (id) => {
    const response = await axios.delete(`${API_URL}/exercises/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Assign exercises to members
  assignExercises: async (exerciseIds, memberIds) => {
    const response = await axios.post(
      `${API_URL}/exercises/assign`,
      { exerciseIds, memberIds },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  // Remove exercise assignment from a member
  removeExerciseAssignment: async (exerciseId, memberId) => {
    const response = await axios.delete(
      `${API_URL}/exercises/${exerciseId}/member/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
};

export default exerciseService; 