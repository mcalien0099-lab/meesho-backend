const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productName: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    items: [orderItemSchema],
    amount: { type: Number, default: 0 },
    status: { type: String, default: "Address Saved" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
