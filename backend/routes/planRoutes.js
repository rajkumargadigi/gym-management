import express from 'express';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from '../controllers/planController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPlans)
  .post(protect, adminOnly, createPlan);

router.route('/:id')
  .put(protect, adminOnly, updatePlan)
  .delete(protect, adminOnly, deletePlan);

export default router;
