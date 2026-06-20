const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true },
    page: { type: String, required: true },
    sessionId: { type: String, default: "" },
    deviceInfo: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for efficient querying by date range and page
analyticsSchema.index({ createdAt: 1 });
analyticsSchema.index({ page: 1, createdAt: 1 });
analyticsSchema.index({ visitorId: 1, createdAt: 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
