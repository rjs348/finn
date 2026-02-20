const express = require("express");
const Election = require("../models/Election");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/election/status — public
router.get("/status", async (req, res) => {
    try {
        let election = await Election.findOne();
        if (!election) {
            election = await Election.create({ status: "open" });
        }
        res.json({ status: election.status });
    } catch (error) {
        console.error("Get election status error:", error);
        res.status(500).json({ error: "Failed to get election status" });
    }
});

// PUT /api/election/toggle — admin only
router.put("/toggle", requireAdmin, async (req, res) => {
    try {
        let election = await Election.findOne();
        if (!election) {
            election = await Election.create({ status: "open" });
        }

        election.status = election.status === "open" ? "closed" : "open";
        await election.save();

        res.json({ status: election.status, message: `Election ${election.status}` });
    } catch (error) {
        console.error("Toggle election error:", error);
        res.status(500).json({ error: "Failed to toggle election status" });
    }
});

module.exports = router;
