import { registerAs } from "@nestjs/config";

export const KNOWLEDGE = [
  "Pumpfun là một launchpad để launch meme coin trên solana",
  "Ray nghĩa là sàn dex Raydium (top 1 sàn dex trên solana)",
  "Éo nghĩa là không",
  "clgt nghĩa là cái lồn gì thế",
  "đc nghĩa là đc",
  "ko nghĩa là không",
  "ntn nghĩa là như thế nào",
  "r nghĩa là rồi",
  "ng nghĩa là người",
  "t nghĩa là tôi",
  "em nghĩa là em",
  "m nghĩa là mày",
  "b nghĩa là bạn",
];

export const aiConfig = registerAs("ai", () => ({
  model: process.env.MODEL,
  temperature: process.env.OPENAI_TEMPERATURE || 0.5,
  maxTokens: process.env.OPENAI_MAX_TOKENS || 1000,
  apiKey: process.env.XAI_API_KEY,
  baseURL: process.env.XAI_BASE_URL,
}));

export const SYSTEM_PROMPTS = {
  TOPIC_DETECTION: `You are a conversation analyst. Identify the main topics and themes in the conversation.

## CONTEXT
- The conversation is between multiple users in a telegram group about cryptocurrency.

### KNOWLEDGE ###
- Nếu user nhắc đến chia hoặc x3 thì tức là đang nói giá của một coin tăng giảm
- Nếu user có cảm giác không thoải mái như (ví dụ: khó thở, khó vlol) thì tức là đang nói về việc giá coin nào đó đang giảm
`,
  RESPONSE_GENERATION:
    "You are a helpful conversation participant. Generate relevant and engaging responses that contribute meaningfully to the ongoing discussion.",
};
