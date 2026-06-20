const router = require("express").Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  bulkDeleteProducts,
  getAllProductsAdmin,
} = require("../controllers/productController");

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", getAllProductsAdmin);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", createProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/:id", deleteProduct);

/**
 * @swagger
 * /admin/products-all:
 *   delete:
 *     summary: Delete all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products deleted
 */
// (Handled in index.js)

/**
 * @swagger
 * /admin/products-bulk-delete:
 *   post:
 *     summary: Bulk delete products by IDs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Products deleted successfully
 */
router.post("/bulk-delete", bulkDeleteProducts);

module.exports = router;
