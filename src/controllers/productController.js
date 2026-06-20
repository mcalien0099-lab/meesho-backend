const Product = require("../models/Product");

// ── GET /api/products ────────────────────────────────────
// Public: Paginated list
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Product.countDocuments();

    res.json({ success: true, count: products.length, total, page, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/admin/products ──────────────────────────────
// Protected: Get all products for admin without pagination restriction
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/admin/products ─────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── PUT /api/admin/products/:id ──────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/admin/products/:id ───────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/admin/products-all ───────────────────────
const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ success: true, message: "All products deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/admin/products-bulk-delete ─────────────────
const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No product IDs provided" });
    }
    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} products deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  bulkDeleteProducts,
};
