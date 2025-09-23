// routes/FeedbackRoute.js - අලුතින් routes add කරන්න
import express from 'express';
import {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  addAdminReply
} from '../controller/FeedbackController.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import Feedback from '../model/FeedbackModel.js';

const router = express.Router();

// 🔓 PUBLIC ROUTES (තාවකාලිකව authentication නැතිව)
// Get all feedbacks without authentication
router.get('/public/all', async (req, res) => {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'All feedback retrieved successfully.',
      count: feedback.length,
      feedback: feedback
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error while fetching feedback.', 
      error: error.message 
    });
  }
});

// Admin reply without authentication
router.put('/public/:id/reply', async (req, res) => {
  try {
    const { replyMessage, repliedBy } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ message: 'Reply message is required.' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: {
          message: replyMessage,
          repliedBy: repliedBy || 'Temporary Admin',
          repliedAt: new Date()
        },
        status: 'In Review'
      },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    res.status(200).json({ 
      message: 'Reply added successfully!', 
      feedback: updatedFeedback 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error while adding reply.', 
      error: error.message 
    });
  }
});

// Update status without authentication
router.put('/public/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    res.status(200).json({ 
      message: 'Status updated successfully!', 
      feedback: updatedFeedback 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error while updating status.', 
      error: error.message 
    });
  }
});

// 🔐 PROTECTED ROUTES (මුල් routes තියෙනවා)
router.post('/', authRequired, createFeedback);
router.get('/my-feedback', authRequired, getMyFeedback);
router.get('/', authRequired, requireRole('admin'), getAllFeedback);
router.put('/:id/reply', authRequired, requireRole('admin'), addAdminReply);

export default router;