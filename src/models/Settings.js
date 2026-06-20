const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // Branding
    logoName: { type: String, default: "meesho" },
    logoUrl: { type: String, default: "" },
    primaryColor: { type: String, default: "#9f2089" },
    accentColor: { type: String, default: "#f43397" },
    cartBannerUrl: { type: String, default: "" },
    cartBannerLink: { type: String, default: "" },

    // UPI Settings
    upiId: { type: String, default: "" },
    upiGateway: { type: String, enum: ["paytm", "razorpay"], default: "paytm" },
    razorpayUpiId: { type: String, default: "" },
    razorpayTr: { type: String, default: "" },

    // UPI App Visibility
    showPhonePe: { type: Boolean, default: true },
    showGPay: { type: Boolean, default: true },
    showPaytm: { type: Boolean, default: true },
    showAmazonPay: { type: Boolean, default: true },
    showBHIM: { type: Boolean, default: true },

    // UPI App Offers
    phonepeOfferText: { type: String, default: "" },
    phonepeDiscountAmount: { type: Number, default: 0 },
    gpayOfferText: { type: String, default: "" },
    gpayDiscountAmount: { type: Number, default: 0 },
    paytmOfferText: { type: String, default: "" },
    paytmDiscountAmount: { type: Number, default: 0 },
    amazonpayOfferText: { type: String, default: "" },
    amazonpayDiscountAmount: { type: Number, default: 0 },
    bhimOfferText: { type: String, default: "" },
    bhimDiscountAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
