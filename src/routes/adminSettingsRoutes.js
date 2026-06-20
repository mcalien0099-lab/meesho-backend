const router = require("express").Router();
const { updateSettings, getSettingsAdmin } = require("../controllers/settingsController");

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     summary: Get settings (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current settings
 */
router.get("/", getSettingsAdmin);

/**
 * @swagger
 * /admin/settings:
 *   put:
 *     summary: Update settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put("/", updateSettings);

module.exports = router;
