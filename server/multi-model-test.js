require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function testModels() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const modelsToTest = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-2.0-pro-exp-02-05", // Experimental but powerful
        "gemini-flash-latest",
        "gemini-1.0-pro"
    ];

    let log = `Testing models with API Key length: ${apiKey.length}\n\n`;

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTest) {
        log += `--- Testing ${modelName} ---\n`;
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'hello'");
            const response = await result.response;
            log += `SUCCESS: ${response.text()}\n`;
        } catch (err) {
            log += `FAILURE: ${err.message}\n`;
        }
        log += `\n`;
    }

    fs.writeFileSync('multi-model-test.log', log);
    console.log("Multi-model test complete. Check multi-model-test.log");
}

testModels();
