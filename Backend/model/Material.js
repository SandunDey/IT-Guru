// Backend/model/Material.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MaterialSchema = new Schema(
  {
    mid: { type: String, index: true }, // unique below via partial index
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Note", "Slide", "Reading"], default: "Note" },
    topic: { type: String, default: "" },
    subject: { type: String, default: "" },     // optional alias
    week: { type: Number, default: 0 },
    link: { type: String, default: "" },
    desc: { type: String, default: "" },
    description: { type: String, default: "" }, // optional alias
    batch: { type: String, default: null },     // e.g. "2026 A/L"
    grade: { type: String, default: null },     // alias for batch if you use it
    year: { type: Number, default: null },
  },
  { timestamps: true }
);

// Make mid unique **only when it exists & not null** (prevents E11000 on null)
MaterialSchema.index(
  { mid: 1 },
  { unique: true, partialFilterExpression: { mid: { $exists: true, $ne: null } } }
);

const Material = model("Material", MaterialSchema);
export default Material;
