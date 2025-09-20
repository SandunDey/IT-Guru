// Backend/routes/FeedbackRoute.js

import express from 'express';
import {
  createFeedback,
  getUserFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
  adminUpdateFeedback
} from '../controller/FeedbackController.js';
import verifyJWT from '../middleware/auth.js';

const router = express.Router();

// --- User Routes ---
router.post('/', verifyJWT, createFeedback);
router.get('/my-feedback', verifyJWT, getUserFeedback);

// --- Admin Routes ---
router.get('/admin/all', verifyJWT, getAllFeedback);
router.put('/admin/:id', verifyJWT, adminUpdateFeedback);


// Note: The following routes require implementation in the controller if you need them
router.get('/:id', verifyJWT, getFeedbackById);
router.put('/:id', verifyJWT, updateFeedback);
router.delete('/:id', verifyJWT, deleteFeedback);


export default router;