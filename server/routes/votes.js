const express = require("express");
const Student = require("../models/Student");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");
const { requireStudent } = require("../middleware/auth");

const router = express.Router();

// POST /api/votes — cast a vote (student only)
router.post("/", requireStudent, async (req, res) => {
    try {
        const { candidateId } = req.body;

        if (!candidateId) {
            return res.status(400).json({ error: "Candidate ID is required" });
        }

        // Check election is open
        const election = await Election.findOne();
        if (!election || election.status !== "open") {
            return res.status(403).json({ error: "Voting is currently closed" });
        }

        // Re-fetch student to get latest hasVoted status
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        if (student.hasVoted) {
            return res.status(403).json({ error: "You have already voted" });
        }

        // Check candidate exists and is active
        const candidate = await Candidate.findById(candidateId);
        if (!candidate || candidate.status !== "active") {
            return res.status(404).json({ error: "Candidate not found or inactive" });
        }

        // Atomically increment votes
        await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

        // Mark student as voted
        student.hasVoted = true;
        await student.save();

        res.json({ message: "Vote cast successfully" });
    } catch (error) {
        console.error("Vote error:", error);
        res.status(500).json({ error: "Failed to cast vote" });
    }
});

module.exports = router;
