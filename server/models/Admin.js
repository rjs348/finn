const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        adminId: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }
);

adminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("Admin", adminSchema);
