const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        course: { type: String, required: true, trim: true },
        photo: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        },
        votes: { type: Number, default: 0 },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
