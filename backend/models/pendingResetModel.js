import mongoose from "mongoose";

// Stores pending password reset OTPs
const pendingResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    // optional: mark if OTP was verified (helps prevent reuse)
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const pendingResetModel =
  mongoose.models.pending_reset || mongoose.model("pending_reset", pendingResetSchema);

export default pendingResetModel;
