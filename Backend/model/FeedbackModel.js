import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // or 'User' depending on your user model
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: [true, 'Message is required.'],
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['General', 'Technical', 'Course', 'Payment', 'Support', 'Other'],
    default: 'General'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ['New', 'In Review', 'Resolved', 'Closed'],
    default: 'New'
  },
  adminReply: {
    message: String,
    repliedBy: String,
    repliedAt: Date
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;