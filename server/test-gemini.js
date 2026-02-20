const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY is missing in .env file!");
        return;
    }

    console.log(`Testing Gemini API with key: ${apiKey.substring(0, 10)}... (Length: ${apiKey.length})`);
    if (apiKey.startsWith('"') || apiKey.endsWith('"')) {
        console.warn("⚠️  WARNING: Your API key in .env seems to have literal quotes around it. This might cause failures.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        console.log("Attempting to list authorized models...");
        try {
            const models = await genAI.listModels();
            console.log("Authorized models:");
            models.models.forEach(m => console.log(` - ${m.name}`));
        } catch (err) {
            console.log("Failed to list models:", err.message);
        }

        console.log("\nTesting 'gemini-1.5-flash'...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("hello");
            console.log("Success! Response:", (await result.response).text());
        } catch (e) {
            console.log("Failure:", e.message);
        }
    } catch (error) {
        console.error("❌ FAILURE!");
        console.error("Error Message:", error.message);
        if (error.status === 403) {
            console.error("Suggestion: Your API key might be invalid or your region is not supported by Google Gemini.");
        } else if (error.code === 'ENOTFOUND') {
            console.error("Suggestion: Check your internet connection. Cannot reach Google API.");
        }
    }
}

testGemini();
