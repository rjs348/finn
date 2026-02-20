const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function run() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest",
        "gemini-pro"
    ];

    for (const modelName of modelsToTry) {
        console.log(`\n--- Testing Model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ ${modelName} SUCCESS:`, response.text());
            return;
        } catch (err) {
            console.log(`❌ ${modelName} FAILED:`, err.message);
            if (err.response) {
                console.log("Response Body:", JSON.stringify(err.response, null, 2));
            }
        }
    }
}

run();
