const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

async function run() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const names = response.data.models.map(m => m.name);
        fs.writeFileSync("models_list.txt", names.join("\n"));
        console.log("Written models to models_list.txt");
    } catch (err) {
        console.log("Error:", err.message);
    }
}
run();
