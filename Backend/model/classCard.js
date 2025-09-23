import mongoose from "mongoose";

const classCardSchema = new mongoose.Schema(
  { 
    card_id: {
        type: Number,
        required: true,
        unique: true
    },
    class_name: {
      type: String,
      required: true,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      default: 30,
      immutable: true, // cannot be changed once set
    },
  },
  { timestamps: true }
);

const ClassCard = mongoose.model("ClassCard", classCardSchema);
export default ClassCard;
