const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");
const path = require("path");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const admins = await Admin.find({});
        console.log(`Found ${admins.length} admin(s).`);

        for (const admin of admins) {
            // Get raw document to check for fields not in schema
            const rawAdmin = admin.toObject({ virtuals: false });

            // If the field is named "password" (from my previous mistake), migrate it
            if (rawAdmin.password && !admin.passwordHash) {
                console.log(`Migrating "password" field to "passwordHash" for: ${admin.adminId}`);
                admin.passwordHash = rawAdmin.password;
                // Delete the old field manually if using lean/raw, but since we are using Mongoose model,
                // we just need to ensure passwordHash is set and save.
                // Mongoose might not remove the extra field unless strict is set, but we can fix the data.
            }

            if (!admin.passwordHash) {
                console.log(`Admin ${admin.adminId} has NO password field. Skipping.`);
                continue;
            }

            // Check if passwordHash is already a bcrypt hash
            if (admin.passwordHash.startsWith("$2a$") || admin.passwordHash.startsWith("$2b$") || admin.passwordHash.startsWith("$2y$")) {
                console.log(`Admin ${admin.adminId} password already hashed. Skipping.`);
                continue;
            }

            console.log(`Hashing password for admin: ${admin.adminId}`);
            await admin.save();
            console.log(`Successfully fixed password for ${admin.adminId}`);
        }

        console.log("Migration completed.");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    }
}

migrate();
