import mongoose from "mongoose";
import "./Student.js";
import "./classCard.js";


const PaymentSchema = new mongoose.Schema(
  {
    // who this payment belongs to (optional if you don't have users yet)

    payment_id: {
        type: Number,
        required: true,
        unique: true
    },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    class_name:{
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be >= 0"]
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "cancelled"],
      default: "pending",
      index: true
    },
    description: { type: String, maxlength: 500 },
  },
  { timestamps: true }




);

export default mongoose.model("Payment", PaymentSchema);
