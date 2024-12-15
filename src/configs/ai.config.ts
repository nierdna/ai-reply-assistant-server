
import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  model: process.env.MODEL,
  temperature: process.env.OPENAI_TEMPERATURE || 0.5,
  maxTokens: process.env.OPENAI_MAX_TOKENS || 1000,
  apiKey: process.env.XAI_API_KEY,
  baseURL: process.env.XAI_BASE_URL,
}));
