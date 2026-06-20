const router = require("express").Router();
const { getProducts } = require("../controllers/productController");
const { getCategories } = require("../controllers/categoryController");
const { getBanners } = require("../controllers/bannerController");
const { getReviews } = require("../controllers/reviewController");
const { createOrder } = require("../controllers/orderController");
const { getSettings } = require("../controllers/settingsController");
const { logPageView } = require("../controllers/analyticsController");
const { createPaymentTrack, updatePaymentTrack, markPaymentTrackClicked } = require("../controllers/paymentTrackController");
const { checkBlockStatus, reportScreenshot } = require("../controllers/blockedUserController");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get public products
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/products", getProducts);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get public categories
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Get public banners
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of banners
 */
router.get("/banners", getBanners);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get public reviews
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/reviews", getReviews);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order lead
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/orders", createOrder);

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get store settings
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Store settings
 */
router.get("/settings", getSettings);

/**
 * @swagger
 * /analytics/log:
 *   post:
 *     summary: Log a page view
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Page view logged
 */
router.post("/analytics/log", logPageView);

/**
 * @swagger
 * /payment-tracks:
 *   post:
 *     summary: Create payment track
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Payment track created
 */
router.post("/payment-tracks", createPaymentTrack);

/**
 * @swagger
 * /payment-tracks/{id}:
 *   put:
 *     summary: Update payment track
 *     tags: [User]
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
 *         description: Payment track updated
 */
router.put("/payment-tracks/:id", updatePaymentTrack);

/**
 * @swagger
 * /payment-tracks/{id}/click:
 *   put:
 *     summary: Mark payment track as clicked
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment track marked as clicked
 */
router.put("/payment-tracks/:id/click", markPaymentTrackClicked);

/**
 * @swagger
 * /check-block-status:
 *   get:
 *     summary: Check if device is blocked
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Block status
 */
router.get("/check-block-status", checkBlockStatus);

/**
 * @swagger
 * /report-screenshot-attempt:
 *   post:
 *     summary: Report screenshot attempt
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Screenshot reported
 */
router.post("/report-screenshot-attempt", reportScreenshot);

module.exports = router;
