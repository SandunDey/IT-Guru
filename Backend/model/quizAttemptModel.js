// models/quizAttemptModel.js
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  qIndex: Number,         // original question index (before shuffle)
  chosenIndex: Number,    // chosen option index as sent by client (after shuffle mapping)
  isCorrect: Boolean,
  marksAwarded: { type: Number, default: 0 },
}, { _id: false });

const QuizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  studentId: { type: String, required: true },  // use your real student _id/email
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  answers: { type: [AnswerSchema], default: [] },
}, { timestamps: true });

QuizAttemptSchema.index({ quizId: 1, studentId: 1 });

export default mongoose.model("QuizAttempt", QuizAttemptSchema);
