const Settings = require("../models/Settings");

// Helper to get or create the single settings doc
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// ── GET /api/settings ────────────────────────────────────
// Public endpoint
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/admin/settings ──────────────────────────────
const getSettingsAdmin = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/admin/settings ──────────────────────────────
const updateSettings = async (req, res) => {
  try {
    let settings = await getOrCreateSettings();
    
    // Update the existing document
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  getSettingsAdmin,
  updateSettings,
};
