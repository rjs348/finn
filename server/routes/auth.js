const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const { sendOtpEmail } = require("../config/emailConfig");

const router = express.Router();

// ── STUDENT: Send OTP ──────────────────────────────────────────────────────
router.post("/student/send-otp", async (req, res) => {
    try {
        const { name, registerNumber, email } = req.body;
        const normalizedRegisterNumber = registerNumber?.trim().toLowerCase();
        const normalizedEmail = email?.trim().toLowerCase();

        if (!name || !normalizedRegisterNumber || !normalizedEmail) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if student exists by Register Number
        const student = await Student.findOne({ registerNumber: normalizedRegisterNumber });
        if (!student) {
            return res.status(404).json({
                error: "Registration not found. Please contact the administrator to register."
            });
        }

        // Verify if details match
        if (student.email !== normalizedEmail) {
            return res.status(400).json({
                error: "The email provided does not match our records for this register number."
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Update student with new OTP
        student.otp = otp;
        student.otpExpiry = otpExpiry;
        await student.save();

        // Send the real OTP via email
        try {
            await sendOtpEmail(email, otp);
            console.log(`OTP sent successfully to ${email}`);

            res.json({
                message: "OTP sent successfully"
            });
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            res.status(500).json({ error: "Failed to send OTP email. Please check your connection or contact admin." });
        }
    } catch (error) {
        console.error("Send OTP error:", error);
        if (res.headersSent) return; // Prevent double response
        res.status(500).json({ error: "Failed to send OTP due to internal server error" });
    }
});

// ── STUDENT: Verify OTP ────────────────────────────────────────────────────
router.post("/student/verify-otp", async (req, res) => {
    try {
        const { registerNumber, otp } = req.body;
        const normalizedRegisterNumber = registerNumber?.trim().toLowerCase();

        if (!normalizedRegisterNumber || !otp) {
            return res.status(400).json({ error: "Register number and OTP are required" });
        }

        const student = await Student.findOne({ registerNumber: normalizedRegisterNumber });
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
        const { adminId, username, password } = req.body;
        const finalAdminId = (adminId || username)?.toLowerCase();

        console.log(`[AUTH DEBUG] Admin login attempt for: "${finalAdminId}"`);

        if (!finalAdminId || !password) {
            return res.status(400).json({ error: "Admin ID/Username and password are required" });
        }

        const admin = await Admin.findOne({ adminId: finalAdminId });
        if (!admin) {
            console.log(`[AUTH DEBUG] Admin not found in DB: "${finalAdminId}"`);
            return res.status(401).json({ error: "Invalid admin ID or password" });
        }

        console.log(`[AUTH DEBUG] Admin found. Comparing password...`);
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            console.log(`[AUTH DEBUG] Password mismatch for: "${finalAdminId}"`);
            return res.status(401).json({ error: "Invalid admin ID or password" });
        }

        console.log(`[AUTH DEBUG] Login SUCCESS for: "${finalAdminId}"`);

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

// ── ADMIN: Forgot Password ───────────────────────────────────────────────
router.post("/admin/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email?.toLowerCase();
        if (!normalizedEmail) {
            return res.status(400).json({ error: "Email is required" });
        }

        const admin = await Admin.findOne({ email: normalizedEmail });
        if (!admin) {
            return res.json({ message: "If an account exists with this email, a reset link has been sent." });
        }

        // Generate token
        const token = crypto.randomBytes(20).toString("hex");
        admin.resetPasswordToken = token;
        admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await admin.save();

        const resetLink = `http://localhost:5173/admin/reset-password/${token}`;
        const { sendResetPasswordEmail } = require("../config/emailConfig");
        await sendResetPasswordEmail(email, admin.adminId, resetLink);

        console.log(`Reset password link sent to: ${email}`);
        res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});

// ── ADMIN: Verify Reset Token ────────────────────────────────────────────
router.get("/admin/reset-password/:token", async (req, res) => {
    try {
        const admin = await Admin.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ error: "Password reset token is invalid or has expired." });
        }

        res.json({ message: "Token is valid" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ── ADMIN: Reset Password ────────────────────────────────────────────────
router.post("/admin/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ error: "Password reset token is invalid or has expired." });
        }

        admin.passwordHash = password; // Pre-save hook will hash it
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();

        res.json({ message: "Password has been successfully reset. You can now login with your new password." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Failed to reset password" });
    }
});

module.exports = router;
