const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
    {
        status: { type: String, enum: ["open", "closed"], default: "open" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Election", electionSchema);
