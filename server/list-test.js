const axios = require("axios");
require("dotenv").config();

async function run() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("AUTHORIZED MODELS:");
        response.data.models.forEach(m => console.log(` - ${m.name}`));
    } catch (err) {
        console.log("❌ LIST FAILED:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
    }
}
run();
