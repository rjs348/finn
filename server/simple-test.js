const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function run() {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        const genAI = new GoogleGenerativeAI(apiKey);

        // Most basic call possible
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("hello");
        console.log("Response:", (await result.response).text());
    } catch (err) {
        console.log("LOGGED ERROR:", err.message);
    }
}
run();
