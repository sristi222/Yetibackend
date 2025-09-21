const Admin = require("../models/admin")

// GET dashboard stats
const getDashboard = async (req, res) => {
  try {
    // Example: return dummy stats for now
    const stats = {
      totalUsers: 120,
      totalOrders: 45,
      totalRevenue: 25000
    }
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

module.exports = { getDashboard }
