import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // who this payment belongs to (optional if you don't have users yet)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be >= 0"]
    },
    currency: {
      type: String,
      enum: ["LKR", "USD", "EUR", "GBP", "INR"],
      default: "LKR",
      required: true
    },
    method: {
      type: String,
      enum: ["card", "bank", "cash", "wallet", "other"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true
    },
    description: { type: String, maxlength: 500 },
    reference: {
      type: String,
      trim: true,
      unique: true,
      sparse: true // allows many nulls
    },
    metadata: {
      type: Map,
      of: String,
      default: {}
    },

    // audit fields
    createdBy: { type: String },
    updatedBy: { type: String },

    // soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

// Only return non-deleted by default
PaymentSchema.pre(/^find/, function (next) {
  if (!this.getQuery()._withDeleted) {
    this.where({ isDeleted: false });
  } else {
    // remove helper flag from query
    delete this.getQuery()._withDeleted;
  }
  next();
});

export default mongoose.model("Payment", PaymentSchema);
