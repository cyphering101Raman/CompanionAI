import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import sttRoute from "./routes/stt.js";
import chatRoute from "./routes/chat.js";
import ttsRoute from "./routes/tts.js";


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());

app.use("/api/v1/stt", sttRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/tts", ttsRoute);

app.listen(5000, () => 
    console.log("Server running on 5000")
);
