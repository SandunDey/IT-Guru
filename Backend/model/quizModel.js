
import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [OptionSchema], required: true }, // [{text}]
  correctIndex: { type: Number, required: true },    // 0..n-1
  marks: { type: Number, default: 1 },
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Quiz","Assignment","Practical"], default: "Quiz" },
  desc: { type: String, default: "" },
  subject: String,
  batch: { type: String, default: "2025 A/L" },
  schedule: Date,
  durationMins: { type: Number, default: 30 },
  totalMarks: { type: Number, default: 0 }, // optional summary
  published: { type: Boolean, default: false },
  questions: { type: [QuestionSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("Quiz", QuizSchema);
