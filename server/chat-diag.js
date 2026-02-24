require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key length:", apiKey ? apiKey.length : "undefined");
    console.log("API Key starts with:", apiKey ? apiKey.substring(0, 5) : "n/a");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test message");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (err) {
        console.error("ERROR TYPE:", err.constructor.name);
        console.error("ERROR MESSAGE:", err.message);
        if (err.response) {
            console.error("RESPONSE DATA:", err.response.data);
        }
    }
}

test();
