const router = require("express").Router();
const {
  getAllReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/", getAllReviewsAdmin);

/**
 * @swagger
 * /admin/reviews:
 *   post:
 *     summary: Create a review
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
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post("/", createReview);

/**
 * @swagger
 * /admin/reviews/{id}:
 *   put:
 *     summary: Update a review
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
 *         description: Review updated successfully
 */
router.put("/:id", updateReview);

/**
 * @swagger
 * /admin/reviews/{id}:
 *   delete:
 *     summary: Delete a review
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
 *         description: Review deleted successfully
 */
router.delete("/:id", deleteReview);

module.exports = router;
