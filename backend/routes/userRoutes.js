import express from 'express';
import {
  updateUserProfile,
  getUserTransactions,
  getUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile routes
router.put('/profile', protect, updateUserProfile);
router.get('/transactions', protect, getUserTransactions);

// Admin CRUD routes
router.route('/')
  .get(protect, adminOnly, getUsers)
  .post(protect, adminOnly, createUserByAdmin);

router.route('/:id')
  .put(protect, adminOnly, updateUserByAdmin)
  .delete(protect, adminOnly, deleteUserByAdmin);

export default router;
