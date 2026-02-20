const mongoose = require("mongoose");
const dns = require("dns");

// Force use of public DNS servers to resolve MongoDB Atlas SRV records
// This is a common fix for Windows environments where local DNS fails to resolve SRV records correctly.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
