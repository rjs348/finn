const axios = require("axios");
require("dotenv").config();

async function run() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const versions = ["v1", "v1beta"];
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const v of versions) {
        console.log(`\n--- Testing API Version: ${v} ---`);
        for (const m of models) {
            const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${apiKey}`;
            try {
                const response = await axios.post(url, {
                    contents: [{ parts: [{ text: "hi" }] }]
                });
                console.log(`✅ ${v}/${m} SUCCESS!`);
                return;
            } catch (err) {
                console.log(`❌ ${v}/${m} FAILED:`, err.response ? err.response.status : err.message);
                if (err.response && err.response.status === 400) {
                    console.log("Details:", JSON.stringify(err.response.data.error, null, 2));
                }
            }
        }
    }
}
run();
