const bcrypt = require("bcryptjs");

const password = process.argv[2] || "admin123";

async function generateHash() {
    console.log("Generating hash for password:", password);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("\n--------------------------------------------------");
    console.log("HASHED PASSWORD:");
    console.log(hash);
    console.log("--------------------------------------------------\n");
    console.log("Copy the code above and paste it into your MongoDB field 'passwordHash'.");
}

generateHash();
