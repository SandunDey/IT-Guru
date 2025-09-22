// models/Video.js
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url:   { type: String, required: true, trim: true },
    batch: { type: String, enum: ["2025 A/L","2026 A/L","2027 A/L"], default: "2025 A/L", index: true },
    published: { type: Boolean, default: false, index: true },
    // optional owner
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
