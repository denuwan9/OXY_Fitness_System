import express from 'express';
import { 
  createOrder, 
  verifyOrderOTP,
  updateOrder,
  deleteOrder,
  getOrders,
  getOrderById
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/verify-otp', verifyOrderOTP);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;