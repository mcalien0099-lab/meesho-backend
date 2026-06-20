const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, default: "" },
    deviceId: { type: String, required: true },
    attempts: { type: Number, default: 1 },
    blocked: { type: Boolean, default: false },
    lastAttemptAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blockedUserSchema.index({ deviceId: 1 }, { unique: true });

module.exports = mongoose.model("BlockedUser", blockedUserSchema);
