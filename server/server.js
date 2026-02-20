const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Election = require("./models/Election");

const authRoutes = require("./routes/auth");
const candidateRoutes = require("./routes/candidates");
const voteRoutes = require("./routes/votes");
const electionRoutes = require("./routes/election");
const chatRoutes = require("./routes/chat");
const adminRoutes = require("./routes/admin");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/vote", voteRoutes); // Changed from /api/votes to match frontend
app.use("/api/election", electionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatbot", chatRoutes); // Support both /chat and /chatbot
app.use("/api/admin", adminRoutes);


// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ── Seed default data ──────────────────────────────────────────────────────
const seedData = async () => {
  // Create default admin if none exists
  const adminExists = await Admin.findOne({ adminId: "admin" });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await Admin.create({ adminId: "admin", passwordHash });
    console.log('Default admin created: ID="admin", Password="admin123"');
  }

  // Create default election status if none exists
  const electionExists = await Election.findOne();
  if (!electionExists) {
    await Election.create({ status: "open" });
    console.log("Default election status created: open");
  }
};

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedData();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();