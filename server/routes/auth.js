const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const router = express.Router();

// ── STUDENT: Login (Send OTP) ─────────────────────────────────────────────
router.post("/student/login", async (req, res) => {
    try {
        const { name, rollNumber, registerNumber, email } = req.body;

        if (!name || !rollNumber || !registerNumber || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Upsert student (create if doesn't exist, update OTP if exists)
        const student = await Student.findOneAndUpdate(
            { rollNumber },
            { name, rollNumber, registerNumber, email, otp, otpExpiry },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // In a real app you'd email the OTP via Nodemailer here.
        // For demo, we return it in the response.
        console.log(`OTP for ${rollNumber}: ${otp}`);

        res.json({
            message: "OTP sent successfully",
            demoOtp: otp, // Remove in production
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// ── STUDENT: Verify OTP ────────────────────────────────────────────────────
router.post("/student/verify", async (req, res) => {
    try {
        const { rollNumber, otp } = req.body;


        if (!rollNumber || !otp) {
            return res.status(400).json({ error: "Roll number and OTP are required" });
        }

        const student = await Student.findOne({ rollNumber });
        if (!student) {
            return res.status(404).json({ error: "Student not found. Please go back and enter your details." });
        }

        // Check OTP
        if (student.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP. Please try again." });
        }

        // Check expiry
        if (!student.otpExpiry || new Date() > student.otpExpiry) {
            return res.status(401).json({ error: "OTP has expired. Please request a new one." });
        }

        // Clear OTP after successful verification
        student.otp = null;
        student.otpExpiry = null;
        await student.save();

        // Issue JWT
        const token = jwt.sign(
            { id: student._id, rollNumber: student.rollNumber, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                email: student.email,
                hasVoted: student.hasVoted,
            },
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});

// ── ADMIN: Login ───────────────────────────────────────────────────────────
router.post("/admin/login", async (req, res) => {
    try {
        const { adminId, password } = req.body;

        if (!adminId || !password) {
            return res.status(400).json({ error: "Admin ID and password are required" });
        }

        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(401).json({ error: "Invalid admin ID or password" });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid admin ID or password" });
        }

        const token = jwt.sign(
            { id: admin._id, adminId: admin.adminId, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ message: "Admin login successful", token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
