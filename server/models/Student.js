const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        rollNumber: { type: String, required: true, unique: true, trim: true },
        registerNumber: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        hasVoted: { type: Boolean, default: false },
        otp: { type: String, default: null },
        otpExpiry: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
