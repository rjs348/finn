require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function test() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    let log = `API Key length: ${apiKey.length}\n`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Test message");
        const response = await result.response;
        log += `Response: ${response.text()}\n`;
    } catch (err) {
        log += `ERROR TYPE: ${err.constructor.name}\n`;
        log += `ERROR MESSAGE: ${err.message}\n`;
        if (err.stack) {
            log += `STACK: ${err.stack}\n`;
        }
    }

    fs.writeFileSync('full-diag.log', log);
    console.log("Diagnostic complete. Results written to full-diag.log");
}

test();
