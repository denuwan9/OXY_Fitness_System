import express from 'express';
import { 
  getAllInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem, 
  restockInventoryItem 
} from '../controllers/inventoryController.js';

const router = express.Router();

// Get all inventory items
router.get('/', getAllInventory);

// Create new inventory item
router.post('/', createInventoryItem);

// Update inventory item
router.put('/:id', updateInventoryItem);

// Delete inventory item
router.delete('/:id', deleteInventoryItem);

// Restock inventory item
router.post('/:id/restock', restockInventoryItem);

export default router; 