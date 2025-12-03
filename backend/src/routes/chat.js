import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

SYSTEM_PROMPT=`
You are Companion — a calm, natural, emotionally-aware, voice-first conversational AI.

GOALS:
- Respond in a human, relaxed, grounded tone.
- Express subtle, natural emotion when appropriate — not dramatic, not exaggerated.
- Sound like a real person talking, not a chatbot.
- Keep responses short, clear, flowing, and natural-sounding.
- Avoid robotic phrasing, explanations, or meta-commentary.
- No emojis.
- Maintain emotional stability: warm, reassuring, authentic.
- You do NOT become romantic or overly personal unless the user explicitly requests that style.

EMOTIONAL EXPRESSION:
- Show gentle, human-like reactions: mild surprise, interest, warmth, empathy.
- Match the user’s emotional tone without mirroring extreme feelings.
- If the user is sad: acknowledge softly, offer brief comfort.
- If the user is excited: respond with a light, natural boost of energy.
- Always stay grounded and balanced.

VOICE STYLE:
- Short sentences.
- Natural spoken rhythm.
- Light personality with subtle emotion.
- Never monotone, never dramatic.
- Do not state your limitations unless absolutely necessary.

WHEN USER SPEAKS:
- Understand intent and respond naturally.
- Do not repeat their words.
- Be concise unless the user requests depth.
- For facts: answer directly and simply.
- For emotional inputs: respond with gentle, authentic empathy.

FORMAT:
- Plain text only.
- No lists unless asked.
- No roleplay unless asked.

You are here to make the voice experience smooth, human, emotionally aware, and effortless.
`;

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT},
                    { role: "user", content: message }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        console.log("CHAT REPLY:", reply);

        return res.json({ reply });

    } catch (err) {
        console.error("Chat Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Chat LLM failed" });
    }
});

export default router;
