const PaymentTrack = require("../models/PaymentTrack");

// ── POST /api/payment-tracks ─────────────────────────────
// Public: Track that a user reached the payment page
const createPaymentTrack = async (req, res) => {
  try {
    const track = await PaymentTrack.create(req.body);
    res.status(201).json({ success: true, data: track });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/payment-tracks/:id ──────────────────────────
// Public: Update payment method selection
const updatePaymentTrack = async (req, res) => {
  try {
    const track = await PaymentTrack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!track) return res.status(404).json({ success: false, message: "Track not found" });
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/payment-tracks/:id/click ────────────────────
// Public: Mark as "Pay Now" clicked
const markPaymentTrackClicked = async (req, res) => {
  try {
    const track = await PaymentTrack.findByIdAndUpdate(req.params.id, { status: "clicked_pay_now" }, { new: true });
    if (!track) return res.status(404).json({ success: false, message: "Track not found" });
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET /api/admin/payment-tracks ────────────────────────
const getPaymentTracks = async (req, res) => {
  try {
    const tracks = await PaymentTrack.find().sort({ createdAt: -1 }).populate("orderId");
    res.json({ success: true, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/admin/payment-tracks/:id ─────────────────
const deletePaymentTrack = async (req, res) => {
  try {
    const track = await PaymentTrack.findByIdAndDelete(req.params.id);
    if (!track) return res.status(404).json({ success: false, message: "Track not found" });
    res.json({ success: true, message: "Payment track deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPaymentTrack,
  updatePaymentTrack,
  markPaymentTrackClicked,
  getPaymentTracks,
  deletePaymentTrack,
};
