const Analytics = require("../models/Analytics");

// ── POST /api/analytics/log ──────────────────────────────
// Public: Track page view
const logPageView = async (req, res) => {
  try {
    const { visitorId, page, deviceInfo, sessionId } = req.body;
    
    // Extract IP safely (supports proxies/Vercel)
    const ipAddress = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress || "";

    const analytics = await Analytics.create({
      visitorId,
      page,
      deviceInfo,
      sessionId,
      ipAddress,
    });
    
    res.status(201).json({ success: true, data: analytics });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── GET /api/admin/analytics ─────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const range = req.query.range || "24h";
    const now = new Date();
    let startDate = new Date();
    
    // Calculate date range
    if (range === "24h") startDate.setHours(now.getHours() - 24);
    else if (range === "7d") startDate.setDate(now.getDate() - 7);
    else if (range === "30d") startDate.setDate(now.getDate() - 30);
    else startDate.setHours(now.getHours() - 24); // default

    // Basic aggregations
    const totalPageViews = await Analytics.countDocuments({ createdAt: { $gte: startDate } });
    
    // Unique visitors
    const uniqueVisitorsResult = await Analytics.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$visitorId" } },
      { $count: "count" }
    ]);
    const totalUniqueVisitors = uniqueVisitorsResult[0]?.count || 0;

    // Funnel
    const funnelSteps = [
      "home", "categories", "mall", // browsing
      "product-detail",
      "cart",
      "address",
      "payment"
    ];
    
    const funnelData = {};
    for (const step of funnelSteps) {
      funnelData[step] = await Analytics.countDocuments({ 
        page: step, 
        createdAt: { $gte: startDate } 
      });
    }

    res.json({ 
      success: true, 
      data: {
        totalPageViews,
        totalUniqueVisitors,
        funnel: funnelData,
        // (In a full prod app you would add more complex aggregations here for chart data)
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logPageView,
  getAnalytics,
};
