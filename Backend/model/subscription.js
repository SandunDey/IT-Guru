import mongoose from "mongoose";
import "./Student.js";
import "./classCard.js";

const subscriptionSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true,
  },
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassCard",
    required: true,
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "expired", "canceled", "pending"],
    default: "pending",
  },
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
