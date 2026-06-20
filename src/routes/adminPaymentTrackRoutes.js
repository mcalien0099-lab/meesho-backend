const router = require("express").Router();
const { getPaymentTracks, deletePaymentTrack } = require("../controllers/paymentTrackController");

/**
 * @swagger
 * /admin/payment-tracks:
 *   get:
 *     summary: Get all payment tracks
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payment tracks
 */
router.get("/", getPaymentTracks);

/**
 * @swagger
 * /admin/payment-tracks/{id}:
 *   delete:
 *     summary: Delete a payment track
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
 *         description: Payment track deleted successfully
 */
router.delete("/:id", deletePaymentTrack);

module.exports = router;
