import express from 'express';
import { createOrder, verifyPayment, getAllTransactions } from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllTransactions);
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
