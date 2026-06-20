const BlockedUser = require("../models/BlockedUser");

// ── GET /api/check-block-status ──────────────────────────
// Public: Check if the current device is blocked
const checkBlockStatus = async (req, res) => {
  try {
    const { deviceId } = req.query;
    if (!deviceId) return res.status(400).json({ success: false, message: "deviceId is required" });

    const user = await BlockedUser.findOne({ deviceId });
    if (user && user.blocked) {
      return res.status(403).json({ success: false, blocked: true, message: "Device is blocked due to policy violations" });
    }
    
    res.json({ success: true, blocked: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/report-screenshot-attempt ──────────────────
// Public: Report that a user tried to screenshot
const reportScreenshot = async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ success: false, message: "deviceId is required" });

    const ipAddress = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress || "";

    let user = await BlockedUser.findOne({ deviceId });
    
    if (!user) {
      user = await BlockedUser.create({ deviceId, ipAddress, attempts: 1 });
    } else {
      user.attempts += 1;
      user.ipAddress = ipAddress; // update IP just in case
      user.lastAttemptAt = new Date();
      // Block automatically if >= 2 attempts
      if (user.attempts >= 2) {
        user.blocked = true;
      }
      await user.save();
    }

    res.json({ success: true, blocked: user.blocked, attempts: user.attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/admin/blocked-users ─────────────────────────
const getBlockedUsers = async (req, res) => {
  try {
    const users = await BlockedUser.find().sort({ lastAttemptAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/admin/blocked-users/:id ──────────────────
// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const user = await BlockedUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User unblocked and removed from list" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkBlockStatus,
  reportScreenshot,
  getBlockedUsers,
  unblockUser,
};
