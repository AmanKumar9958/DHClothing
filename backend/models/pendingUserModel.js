import mongoose from "mongoose";

// Stores pending signups awaiting OTP verification
const pendingUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Store hashed password to avoid plain text
    password: { type: String, required: true },
    // OTP is stored hashed for security
    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const pendingUserModel =
  mongoose.models.pending_user ||
  mongoose.model("pending_user", pendingUserSchema);

export default pendingUserModel;
