const router = require("express").Router();
const { getBlockedUsers, unblockUser } = require("../controllers/blockedUserController");

/**
 * @swagger
 * /admin/blocked-users:
 *   get:
 *     summary: Get blocked users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blocked users
 */
router.get("/", getBlockedUsers);

/**
 * @swagger
 * /admin/blocked-users/{id}:
 *   delete:
 *     summary: Unblock a user
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
 *         description: User unblocked successfully
 */
router.delete("/:id", unblockUser);

module.exports = router;
