require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// ── Seed Admin User ───────────────────────────────────────
const seedAdmin = async () => {
  const Admin = require("./models/Admin");
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({
      email: "admin@meesho.com",
      password: "password123", // Will be hashed by pre-save hook
      role: "admin",
    });
    console.log("🌱 Default admin created: admin@meesho.com / password123");
  }
};

// ── Connect to MongoDB then start server ────────────────
connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
  });
});
