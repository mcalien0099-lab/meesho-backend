const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    
    // 1. Total Revenue (Completed or Delivered orders)
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ["Completed", "Delivered", "Shipped"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Total Users (Unique phones)
    const usersResult = await Order.distinct("phone");
    const totalUsers = usersResult.length;

    // 4. Growth (Current month vs Last month revenue)
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthRev = await Order.aggregate([
      { $match: { createdAt: { $gte: currentMonthStart }, status: { $in: ["Completed", "Delivered", "Shipped"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const lastMonthRev = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }, status: { $in: ["Completed", "Delivered", "Shipped"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const cmRev = currentMonthRev[0]?.total || 0;
    const lmRev = lastMonthRev[0]?.total || 0;
    
    let growth = 0;
    if (lmRev === 0) {
      growth = cmRev > 0 ? 100 : 0;
    } else {
      growth = ((cmRev - lmRev) / lmRev) * 100;
    }

    // 5. Sales Data (Grouped by month for the chart)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const salesAggregation = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $in: ["Completed", "Delivered", "Shipped"] } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Map aggregation results to month names, ensuring 0 for months without sales
    const salesData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1; // 1-12
      const agg = salesAggregation.find(a => a._id === m);
      salesData.push({
        name: monthNames[m - 1],
        sales: agg ? agg.sales : 0
      });
    }

    // 6. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id name createdAt amount status");

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        growth: growth.toFixed(1),
        salesData,
        recentOrders: recentOrders.map(o => ({
          id: "#ORD-" + o._id.toString().slice(-6).toUpperCase(),
          customer: o.name,
          date: o.createdAt.toISOString().split('T')[0],
          amount: `₹${(o.amount || 0).toFixed(2)}`,
          status: o.status || "Pending"
        }))
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error fetching dashboard stats" });
  }
};

module.exports = {
  getDashboardStats
};
