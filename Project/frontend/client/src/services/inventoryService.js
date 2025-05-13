import axios from 'axios';

const API_URL = 'http://localhost:6017/api/inventory';

// Get all inventory items
export const getAllInventory = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

// Create new inventory item
export const createInventoryItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

// Update inventory item
export const updateInventoryItem = async (id, itemData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

// Restock inventory item
export const restockInventoryItem = async (id, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/restock`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error restocking inventory item:', error);
    throw error;
  }
}; 