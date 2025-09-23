import Feedback from '../model/FeedbackModel.js';

// --- Create new feedback ---
export const createFeedback = async (req, res) => {
  try {
    const { title, message, category, rating } = req.body;

    // Validate input
    if (!title || !message || !rating) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }


    // Use id, _id, or sub from req.user for userId
    const userId = req.user.id || req.user._id || req.user.sub;
    const userEmail = req.user.email;
    const userName = req.user.name || req.user.fullName || req.user.username;

    const newFeedback = new Feedback({
      userId,
      userEmail,
      userName,
      title,
      message,
      category: category || 'General',
      rating: parseInt(rating)
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json({ 
      message: 'Feedback submitted successfully!', 
      feedback: savedFeedback 
    });
  } catch (error) {
    console.log("Error creating feedback:", error);
    res.status(500).json({ message: 'Server error while submitting feedback.', error: error.message });
  }
};

// --- Get user's feedback ---
export const getMyFeedback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

  const userId = req.user.id || req.user._id || req.user.sub;
  const feedback = await Feedback.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Feedback retrieved successfully.',
      count: feedback.length,
      feedback: feedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching feedback.', error: error.message });
  }
};

// --- Get all feedback (Admin only) ---
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'All feedback retrieved successfully.',
      count: feedback.length,
      feedback: feedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching feedback.', error: error.message });
  }
};

// --- Admin reply to feedback ---
export const addAdminReply = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ message: 'Reply message is required.' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: {
          message: replyMessage,
          repliedBy: req.user.name || 'Admin',
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
    res.status(500).json({ message: 'Server error while adding reply.', error: error.message });
  }
};