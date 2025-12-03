import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/audio/speech",
            {
                model: "playai-tts",
                input: text,
                voice: "Celeste-PlayAI",
                response_format: "mp3"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer", // mp3 bytpes
            }
        );

        // Sending mp3 audio
        res.set({
            "Content-Type": "audio/mpeg",
            "Content-Disposition": 'attachment; filename="voice.mp3"',
        });

        return res.send(Buffer.from(response.data));

    } catch (err) {
        console.error("TTS Error:", err.response?.data || err.message);
        res.status(500).json({ error: "TTS failed" });
    }
});

export default router;
