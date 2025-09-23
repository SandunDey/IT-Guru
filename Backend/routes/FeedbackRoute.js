// import express from 'express';
// import {
//   createFeedback,
//   getMyFeedback,
//   getAllFeedback,
//   addAdminReply
// } from '../controller/FeedbackController.js';
// import { authRequired, requireRole } from '../middleware/auth.js';

// const router = express.Router();

// // Create feedback (Logged in users only)
// router.post('/', authRequired, createFeedback);

// // Get user's feedback (Logged in users only)
// router.get('/my-feedback', authRequired, getMyFeedback);

// // Get all feedback (Admin only)
// router.get('/', authRequired, requireRole('admin'), getAllFeedback);

// // Admin reply to feedback (Admin only)
// router.put('/:id/reply', authRequired, requireRole('admin'), addAdminReply);

// export default router;