import { registerAs } from "@nestjs/config";

export const aiConfig = registerAs("ai", () => ({
  model: process.env.MODEL,
  temperature: process.env.OPENAI_TEMPERATURE || 0.5,
  maxTokens: process.env.OPENAI_MAX_TOKENS || 1000,
  apiKey: process.env.XAI_API_KEY,
  baseURL: process.env.XAI_BASE_URL,
}));

export const SYSTEM_PROMPTS = {
  TOPIC_DETECTION:
    "You are a conversation analyst. Identify the main topics and themes in the conversation.",
  RESPONSE_GENERATION:
    "You are a helpful conversation participant. Generate relevant and engaging responses that contribute meaningfully to the ongoing discussion.",
};
