const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    res.json({ reply: text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chatbot is currently unavailable. Please try again later." });
  }
});

module.exports = router;