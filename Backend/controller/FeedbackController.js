// Backend/controller/FeedbackController.js

import Feedback from '../model/FeedbackModel.js';

// --- User Functions ---

// Create new feedback
export const createFeedback = async (req, res) => {
  try {
    const { category, title, message, rating } = req.body;
    const userId = req.user.id;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const newFeedback = new Feedback({
      userId,
      category,
      title,
      message,
      rating,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json({
      message: 'Feedback submitted successfully!',
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({
      message: 'Server error while submitting feedback.',
      error: error.message,
    });
  }
};

// Get all feedback for the logged-in user
export const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedback = await Feedback.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve feedback.', error: error.message });
  }
};


// --- Admin Functions ---

// Admin: Get all feedback from all users
export const getAllFeedback = async (req, res) => {
  // Fix: Check for req.user before accessing its properties
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.status ? { status: req.query.status } : {};

    const feedback = await Feedback.find(filter)
      .populate('userId', 'firstName lastName email') // Populate user info
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(filter);

    res.status(200).json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching feedback.',
      error: error.message,
    });
  }
};

// Admin: Update feedback status or add a reply
export const adminUpdateFeedback = async (req, res) => {
  // Fix: Check for req.user before accessing its properties
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }

  try {
    const { status, reply } = req.body;
    const feedbackId = req.params.id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (status) {
      feedback.status = status;
    }

    if (reply) {
      feedback.replies.push({
        text: reply,
        repliedBy: 'Admin',
        repliedAt: new Date(),
      });
    }

    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback by admin:", error);
    res.status(500).json({ message: 'Server error while updating feedback', error: error.message });
  }
};

// --- Other placeholder functions from your route file ---
// --- ඔබට අවශ්‍ය නම් මේවා ක්‍රියාත්මක කළ හැක ---
export const getFeedbackById = (req, res) => res.status(501).send('Not Implemented');
export const updateFeedback = (req, res) => res.status(501).send('Not Implemented');
export const deleteFeedback = (req, res) => res.status(501).send('Not Implemented');