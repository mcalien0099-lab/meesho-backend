const mongoose = require("mongoose");

const paymentTrackSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    paymentMethod: { type: String, default: "other" },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ["visited", "clicked_pay_now"], default: "visited" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentTrack", paymentTrackSchema);
