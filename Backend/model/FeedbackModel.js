// Backend/model/FeedbackModel.js

import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // පරිශීලකයාගේ Model එක 'Student' ලෙස උපකල්පනය කර ඇත
      required: [true, 'User ID is required.'],
    },
    category: {
      type: String,
      enum: ['General', 'Course Content', 'Platform', 'Technical Issue', 'Suggestion'],
      default: 'General',
    },
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxLength: 100,
    },
    message: {
      type: String,
      required: [true, 'Message is required.'],
      maxLength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false,
    },
    status: {
      type: String,
      enum: ['Open', 'Reviewed', 'In Progress', 'Resolved'],
      default: 'Open',
    },
    replies: [
      {
        text: {
          type: String,
          required: true,
        },
        repliedBy: {
          type: String, // 'Admin' or a specific admin's name
          required: true,
        },
        repliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;