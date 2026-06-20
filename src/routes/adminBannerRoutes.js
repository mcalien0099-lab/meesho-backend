const router = require("express").Router();
const { createBanner, deleteBanner, getAllBannersAdmin } = require("../controllers/bannerController");

/**
 * @swagger
 * /admin/banners:
 *   get:
 *     summary: Get all banners (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all banners
 */
router.get("/", getAllBannersAdmin);

/**
 * @swagger
 * /admin/banners:
 *   post:
 *     summary: Create a banner
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
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Banner created successfully
 */
router.post("/", createBanner);

/**
 * @swagger
 * /admin/banners/{id}:
 *   delete:
 *     summary: Delete a banner
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
 *         description: Banner deleted successfully
 */
router.delete("/:id", deleteBanner);

module.exports = router;
