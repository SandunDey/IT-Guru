import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },//counter ekata unique name denawa
  seq: { type: Number, default: 0 },//auto-increment value store karanawa. Default 0
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
