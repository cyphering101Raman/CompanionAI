import {Router} from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// Store uploaded audio in memory (not disk)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const audioBuffer = req.file.buffer;     // Your audioBlob as Buffer
        const mimeType = req.file.mimetype;      // audio/webm or audio/mp4

        // Prepare STT request
        const formData = new FormData();
        formData.append("file", audioBuffer, {
            filename: "audio.webm",
            contentType: mimeType,
        });
        formData.append("model", "whisper-large-v3");

        // Groq Whisper STT request
        const response = await axios.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    ...formData.getHeaders(),
                },
            }
        );

        const text = response.data.text;
        console.log("STT Result:", text);

        return res.json({ text });

    } catch (err) {
        console.error("STT Error:", err.response?.data || err.message);
        res.status(500).json({ error: "STT failed" });
    }
});

export default router;
