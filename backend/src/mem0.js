import dotenv from "dotenv";
dotenv.config();

import MemoryClient from 'mem0ai';

const memory = new MemoryClient({
    apiKey: process.env.MEM0_API_KEY,
});

export default memory;