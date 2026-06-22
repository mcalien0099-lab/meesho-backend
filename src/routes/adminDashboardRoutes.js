const router = require("express").Router();
const { getDashboardStats } = require("../controllers/adminDashboardController");

router.get("/", getDashboardStats);

module.exports = router;
