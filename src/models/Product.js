const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    price: { type: Number, required: [true, "Price is required"] },
    originalPrice: { type: Number },
    image: { type: String, default: "" },
    category: { type: String, default: "General" },
    description: { type: String, default: "" },
    sizes: [{ type: String }],
    offers: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    gender: { type: String, enum: ["Men", "Women", "Unisex", "Kids", ""], default: "" },
    isPinned: { type: Boolean, default: false },
    batchId: { type: String, default: null },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", category: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
