const axios = require("axios");
require("dotenv").config();

async function run() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "hi" }] }]
        });
        console.log("✅ DIRECT SUCCESS:", response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.log("❌ DIRECT FAILURE:", err.response ? err.response.data : err.message);
    }
}
run();
