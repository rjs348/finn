const express = require("express");
const Candidate = require("../models/Candidate");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET active candidates (public/students)
router.get("/", async (req, res) => {
    try {
        const candidates = await Candidate.find({ status: "active" }).sort({ createdAt: 1 });
        res.json(candidates);
    } catch (error) {
        console.error("Get candidates error:", error);
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});

// GET all candidates (admin only)
router.get("/all", requireAdmin, async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: 1 });
        res.json(candidates);
    } catch (error) {
        console.error("Get all candidates error:", error);
        res.status(500).json({ error: "Failed to fetch all candidates" });
    }
});

// POST add candidate (admin only)
router.post("/", requireAdmin, async (req, res) => {
    try {
        const { name, course, imageUrl, photo } = req.body;

        if (!name || !course) {
            return res.status(400).json({ error: "Missing required fields (Name or Department)" });
        }

        const candidate = await Candidate.create({
            name: name.trim(),
            course: course.trim(),
            photo: (imageUrl || photo)?.trim() ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        });

        console.log(`Candidate created: ${name}`);
        res.status(201).json(candidate);
    } catch (error) {
        console.error("Add candidate error:", error);
        res.status(500).json({ error: "Failed to add candidate" });
    }
});

// PUT update candidate (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
    try {
        const { name, course, imageUrl, photo, status } = req.body;

        const updates = {};
        if (name) updates.name = name.trim();
        if (course) updates.course = course.trim();
        if (imageUrl || photo) updates.photo = (imageUrl || photo).trim();
        if (status) updates.status = status;

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        res.json(candidate);
    } catch (error) {
        console.error("Update candidate error:", error);
        res.status(500).json({ error: "Failed to update candidate" });
    }
});

// DELETE candidate (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        res.json({ message: "Candidate deleted successfully" });
    } catch (error) {
        console.error("Delete candidate error:", error);
        res.status(500).json({ error: "Failed to delete candidate" });
    }
});

module.exports = router;
