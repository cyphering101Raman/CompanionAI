import { useState, useRef, useEffect } from "react";
import { Mic, Play, CircleStop } from "lucide-react";
import HomeModel from "../assets/HomeModel.png";
import axios from "axios";


const BACKEND_PORT_URL = import.meta.env.VITE_BACKEND_PORT_URL;
export default function Home() {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [replyUrl, setReplyUrl] = useState(null);
    const [replyAI, setReplyAI] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioBlob, setAudioBlob] = useState(null);

    const audioRef = useRef(null);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };


    const sendToSTT = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "input.webm");

        const res = await axios.post(`${BACKEND_PORT_URL}/api/v1/stt`, formData,
            {
                headers: { "Content-Type": "multipart/form-data" }
            });


        console.log("transcipt:", res.data.text);
        return res.data.text;
    };

    const startStop = async () => {
        if (!recording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                let options = { mimeType: "audio/webm" };

                if (!MediaRecorder.isTypeSupported("audio/webm")) {
                    options = { mimeType: "audio/mp4" }; // fallback for Safari iOS
                }

                const recorder = new MediaRecorder(stream, options);
                setMediaRecorder(recorder);

                const chunks = [];
                setAudioChunks([]);

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                recorder.onstop = async () => {
                    const blob = new Blob(chunks, { type: chunks[0].type });
                    setAudioBlob(blob);
                    console.log("AUDIO BLOB:", blob); // your raw mic audio

                    try {
                        const text = await sendToSTT(blob);
                        setTranscript(text);

                        const chatRes = await axios.post(`${BACKEND_PORT_URL}/api/v1/chat`, {
                            message: text
                        });

                        console.log("AI REPLY:", chatRes.data.reply);
                        setReplyAI(chatRes.data.reply);

                        const ttsRes = await axios.post(
                            `${BACKEND_PORT_URL}/api/v1/tts`,
                            { text: chatRes.data.reply },
                            { responseType: "blob" }
                        );

                        const audioURL = URL.createObjectURL(ttsRes.data);
                        setReplyUrl(audioURL);
                    } catch (err) {
                        console.error("Error:", err);
                        setTranscript(err?.message || "Error");
                    }
                };

                recorder.start();
                setRecording(true);

            } catch (err) {
                console.error("Mic error:", err);
                alert("Microphone access denied");
            }
        } else {
            // STOP RECORDING
            if (mediaRecorder) {
                mediaRecorder.stop();
                setRecording(false);
            }
        }
    };

    useEffect(() => {
        if (replyUrl && audioRef.current) {
            audioRef.current.play().catch(() => { });
        }
    }, [replyUrl]);



    return (
        <div className="min-h-screen text-[#E9E9F3]">
            <main className="w-[90%] max-w-6xl mx-auto pt-4">

                <section className="flex flex-col md:flex-row items-center gap-10 py-6">

                    <div className="w-full md:w-3/4">
                        <img
                            src={HomeModel}
                            alt="companion model"
                            className="w-full h-auto rounded-3xl shadow-[0_0_40px_#2B1F49] object-cover"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <h1 className="text-4xl font-semibold leading-snug text-center">
                            Your Companion —<br /> Voice-First Conversations
                        </h1>

                        <p className="mt-3 text-[#B4B7D8] text-center">
                            Speak naturally.
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-5 ">

                            <button
                                onClick={startStop}
                                className={`
                                flex items-center gap-2 px-6 py-3 rounded-full font-medium 
                                transition-transform active:scale-95
                                text-[#0B1630]
                                shadow-[0_0_12px_#2B1F49]
                                ${recording ? "bg-red-500 text-white" : "bg-[#F4E96D]"}
                                `}
                            >

                                {!recording ? <>
                                    <Mic className="w-4 h-4" />
                                    Record
                                </> : <>
                                    <CircleStop className="w-4 h-4" />
                                    Stop
                                </>}
                            </button>

                            <button
                                onClick={playAudio}
                                className=" flex items-center gap-2 px-5 py-3 rounded-full  bg-[#FFFFFF22] border border-[#FFFFFF1A] text-[#E9E9F3] backdrop-blur-md shadow-[0_0_10px_#2B1F49] hover:bg-[#FFFFFF33] transition "
                            >
                                <Play className="w-4 h-4" />
                                Play Last
                            </button>

                        </div>
                    </div>
                </section>

                {/* Transcription Caption Section*/}
                <section className=" mt-14  w-full md:w-[60%] mx-auto   bg-[#FFFFFF22]  backdrop-blur-xl  border border-[#FFFFFF1A]    
                    rounded-2xl  p-6  shadow-[0_0_25px_#1A1535] ">

                    <h3 className="text-lg font-semibold text-[#E9E9F3] mb-6 tracking-wide">
                        Latest
                    </h3>

                    <div className="mb-6">
                        <div className="text-xs text-[#B4B7D8] mb-2 uppercase tracking-wide">
                            Transcript
                        </div>

                        <div className=" min-h-[70px]  p-4  rounded-lg  bg-[#0F1B3A]/40  border border-[#FFFFFF10] text-sm  text-[#E9E9F3]  whitespace-pre-lin ">
                            {transcript ? (
                                transcript
                            ) : (
                                <span className="text-[#B4B7D8]">No transcript yet</span>
                            )}
                        </div>
                    </div>

                    <div className="h-px w-full bg-[#FFFFFF15] my-4" />

                    <div>
                        <div className="text-xs text-[#B4B7D8] mb-2 uppercase tracking-wide">
                            Reply
                        </div>

                        <div className=" min-h-[90px]  p-4  rounded-lg  bg-[#0F1B3A]/40  border border-[#FFFFFF10]  text-sm  text-[#E9E9F3]  overflow-y-auto  whitespace-pre-lin ">
                            {replyAI ? (
                                <p className="leading-relaxed">{replyAI}</p>
                            ) : (
                                <span className="text-[#B4B7D8]">No reply yet</span>
                            )}
                        </div>
                    </div>

                </section>
            </main>

            <audio ref={audioRef} src={replyUrl} />

            <footer className="mt-14 pb-4 text-center text-xs text-[#B4B7D8]">
                © {new Date().getFullYear()} Companion — prototype
            </footer>
        </div>
    );
}
