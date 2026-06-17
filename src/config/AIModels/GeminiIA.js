import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../index.js";

const configEnv = config.gemini;

// 1. Inicializar el cliente con tu API Key
const geminiIA = new GoogleGenerativeAI(configEnv.api_key || '');

export default geminiIA;