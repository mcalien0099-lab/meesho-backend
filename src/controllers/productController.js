const Product = require("../models/Product");
const xlsx = require("xlsx");

// ── GET /api/products ────────────────────────────────────
// Public: Paginated list
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit).sort({ isPinned: -1, createdAt: -1 });
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
    const products = await Product.find().sort({ isPinned: -1, createdAt: -1 });
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

// ── POST /api/admin/products/import ─────────────────────────────
const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (req.file.originalname.endsWith('.sql')) {
      const sqlContent = req.file.buffer.toString('utf-8');
      const insertPrefix = "INSERT INTO `tbl_product` (`id`, `index`, `unique_name`, `name`, `is_show`, `category`, `color`, `size`, `storage`, `selling_price`, `mrp`, `fetaures`, `img1`, `img2`, `img3`, `img4`, `img5`, `from_csv`, `created_at`) VALUES\n";
      
      const startIndex = sqlContent.indexOf(insertPrefix);
      if (startIndex === -1) {
        return res.status(400).json({ success: false, message: "Could not find valid tbl_product insert statement in SQL file." });
      }

      let valuesString = sqlContent.substring(startIndex + insertPrefix.length);
      const lines = valuesString.split("\n");
      const productsToInsert = [];

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        let isLast = line.endsWith(");");
        if (line.endsWith(",") || isLast) {
          line = line.slice(0, -1);
        }
        
        if (line.startsWith("(") && line.endsWith(")")) {
          const tupleContent = line.slice(1, -1);
          const cols = [];
          let inString = false;
          let current = "";
          
          for (let i = 0; i < tupleContent.length; i++) {
            const char = tupleContent[i];
            if (char === "'" && (i === 0 || tupleContent[i-1] !== '\\')) {
              inString = !inString;
            } else if (char === "," && !inString) {
              cols.push(current);
              current = "";
              continue;
            }
            current += char;
          }
          cols.push(current);

          const cleanCols = cols.map(c => {
            let val = c.trim();
            if (val === "NULL") return null;
            if (val.startsWith("'") && val.endsWith("'")) {
              val = val.slice(1, -1);
              val = val.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
            }
            return val;
          });

          if (cleanCols.length >= 19) {
            productsToInsert.push({
              name: cleanCols[3] || "Unnamed Product",
              price: Number(cleanCols[9]) || 0,
              originalPrice: Number(cleanCols[10]) || 0,
              image: cleanCols[12] || "",
              category: "General",
              description: cleanCols[11] || "",
              sizes: cleanCols[7] ? [cleanCols[7]] : [],
              isPinned: false,
            });
          }
        }
        
        if (isLast) break;
      }

      if (productsToInsert.length === 0) {
         return res.status(400).json({ success: false, message: "No valid rows found in SQL file" });
      }

      const result = await Product.insertMany(productsToInsert);
      return res.status(201).json({ success: true, message: `${result.length} products imported successfully from SQL` });
    }

    // Default to Excel/CSV processing
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const productsToInsert = rows.map(row => ({
      name: row.name || row.Name || "Unnamed Product",
      price: Number(row.price || row.Price || row.selling_price) || 0,
      originalPrice: Number(row.originalPrice || row.mrp) || 0,
      image: row.image || row.Image || row.img1 || "",
      category: row.category || row.Category || "General",
      description: row.description || row.Description || row.fetaures || "",
      sizes: row.sizes ? String(row.sizes).split(",") : [],
      offers: row.offers ? String(row.offers).split(",") : [],
      rating: Number(row.rating) || 0,
      reviewsCount: Number(row.reviewsCount) || 0,
      gender: row.gender || "",
      isPinned: row.isPinned === "true" || row.isPinned === true,
      batchId: row.batchId || null,
    }));

    if (productsToInsert.length === 0) {
       return res.status(400).json({ success: false, message: "No valid rows found in file" });
    }

    const result = await Product.insertMany(productsToInsert);

    res.status(201).json({ success: true, message: `${result.length} products imported successfully` });
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
  importProducts,
};
