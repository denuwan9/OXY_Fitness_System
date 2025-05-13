import express from 'express';
import { deletePayment, updatePayment, getAllPayment, createPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/pcreate', createPayment);
router.get('/pget', getAllPayment);
router.put('/pupdate/:iid', updatePayment);
router.delete('/pdelete/:id', deletePayment);


export default router;
