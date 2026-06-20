const router = require("express").Router();
const { getAnalytics } = require("../controllers/analyticsController");

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get visitor analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *         description: Date range (e.g., '24h', '7d', '30d')
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get("/", getAnalytics);

module.exports = router;
