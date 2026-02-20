const express = require("express");
const Student = require("../models/Student");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/dashboard — stats (admin only)
router.get("/dashboard", requireAdmin, async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalVotes = await Student.countDocuments({ hasVoted: true });
        const totalCandidates = await Candidate.countDocuments();
        const election = await Election.findOne();

        res.json({
            totalStudents,
            totalVotes,
            totalCandidates,
            electionStatus: election ? election.status : "unknown"
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// PUT /api/admin/election-status — toggle (admin only)
router.put("/election-status", requireAdmin, async (req, res) => {
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
