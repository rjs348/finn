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

// ── Migration logic ────────────────────────────────────────────────────────
const migrateData = async () => {
  try {
    const admins = await Admin.find({});
    for (const admin of admins) {
      const rawAdmin = admin.toObject({ virtuals: false });
      let modified = false;

      // Fix field name if it was incorrectly named "password"
      if (rawAdmin.password && !admin.passwordHash) {
        console.log(`[MIGRATION] Fixing field name for: ${admin.adminId}`);
        admin.passwordHash = rawAdmin.password;
        modified = true;
      }

      // Hash plain text passwords
      if (admin.passwordHash && !admin.passwordHash.startsWith("$2a$") && !admin.passwordHash.startsWith("$2b$")) {
        console.log(`[MIGRATION] Hashing plain-text password for: ${admin.adminId}`);
        // Model middleware will hash it on save()
        modified = true;
      }

      if (modified) {
        await admin.save();
        console.log(`[MIGRATION] Successfully updated admin: ${admin.adminId}`);
      }
    }
  } catch (err) {
    console.error("[MIGRATION] Error during data migration:", err);
  }
};

// ── Seed default data ──────────────────────────────────────────────────────
const seedData = async () => {
  // Create default admin if none exists
  const adminExists = await Admin.findOne({ adminId: "admin" });
  if (!adminExists) {
    // We pass plain text "admin123", the model middleware hashes it automatically
    await Admin.create({ adminId: "admin", passwordHash: "admin123" });
    console.log('Default admin created: ID="admin", Password="admin123"');
  }

  // FORCE RESET "riya" password to riya123
  const riya = await Admin.findOne({ adminId: "riya" });
  if (riya) {
    riya.passwordHash = 'riya123';
    await riya.save();
    console.log('[MIGRATION] Force-reset password for "riya" to "riya123"');
  }

  // Create default election status if none exists
  let election = await Election.findOne();
  if (!election) {
    await Election.create({ status: "open" });
    console.log("Default election status created: open");
  } else {
    // FORCE OPEN for the user if it got stuck
    election.status = "open";
    await election.save();
    console.log("[MIGRATION] Force-set election status to: open");
  }
};

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await migrateData(); // Run migration after connection
  await seedData();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();