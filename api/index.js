const app = require("../src/app");
const connectDB = require("../src/config/db");

// Connect to MongoDB before handling the request
// In a serverless environment, this connection might be reused across invocations
connectDB();

module.exports = app;
