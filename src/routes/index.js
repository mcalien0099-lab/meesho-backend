const router = require("express").Router();
const adminAuth = require("../middleware/adminAuth");

// Public API routes
const publicRoutes = require("./publicRoutes");
router.use("/", publicRoutes);

// Admin Auth routes (public login)
const adminAuthRoutes = require("./adminAuthRoutes");
router.use("/admin", adminAuthRoutes);

// Admin Protected API routes
const adminProductRoutes = require("./adminProductRoutes");
const adminCategoryRoutes = require("./adminCategoryRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");
const adminBannerRoutes = require("./adminBannerRoutes");
const adminReviewRoutes = require("./adminReviewRoutes");
const adminSettingsRoutes = require("./adminSettingsRoutes");
const adminAnalyticsRoutes = require("./adminAnalyticsRoutes");
const adminPaymentTrackRoutes = require("./adminPaymentTrackRoutes");
const adminBlockedUserRoutes = require("./adminBlockedUserRoutes");

const adminDashboardRoutes = require("./adminDashboardRoutes");

// Apply admin auth middleware to all routes below
router.use("/admin/dashboard", adminAuth, adminDashboardRoutes);
router.use("/admin/products", adminAuth, adminProductRoutes);
// Need to add this specific route since the frontend calls it this way
router.delete("/admin/products-all", adminAuth, require("../controllers/productController").deleteAllProducts);
router.post("/admin/products-bulk-delete", adminAuth, require("../controllers/productController").bulkDeleteProducts);

router.use("/admin/categories", adminAuth, adminCategoryRoutes);
router.use("/admin/orders", adminAuth, adminOrderRoutes);
router.use("/admin/banners", adminAuth, adminBannerRoutes);
router.use("/admin/reviews", adminAuth, adminReviewRoutes);
router.use("/admin/settings", adminAuth, adminSettingsRoutes);
router.use("/admin/analytics", adminAuth, adminAnalyticsRoutes);
router.use("/admin/payment-tracks", adminAuth, adminPaymentTrackRoutes);
router.use("/admin/blocked-users", adminAuth, adminBlockedUserRoutes);

module.exports = router;
