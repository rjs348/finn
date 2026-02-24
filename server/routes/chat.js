const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Give the AI context about the system
    const contextPrompt = `You are a helpful assistant for a college election voting system called "NIT Online Voting System". 
    Help students and admins with questions about:
    - How to vote (login with roll number, OTP verification, select candidate)
    - Election schedule and status
    - Admin features (manage candidates, view results, toggle election)
    - OTP verification process
    - Security and fairness of the election
    Keep answers concise and helpful, within 2-3 sentences.
    
    User question: ${message}`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    console.log(`[CHATBOT] Successfully generated response for user message.`);
    res.json({ reply: text });
  } catch (error) {
    if (error.status === 429 || error.message.includes("429")) {
      console.warn("[CHATBOT WARNING] Quota exceeded (429). Advise user to wait.");
      return res.status(429).json({ reply: "I'm a bit overwhelmed with questions right now! Please wait about 30 seconds and try again. 🕒" });
    }

    console.error("[CHATBOT ERROR] Detailed failure:", error.message);
    if (error.status === 403) {
      console.error("[CHATBOT ERROR] Potential API Key issue or invalid region.");
    }
    res.status(500).json({ error: "Chatbot is currently busy. Please try again in safe mode." });
  }
});

module.exports = router;