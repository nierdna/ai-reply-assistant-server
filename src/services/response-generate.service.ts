import { AIRequestOptions, AIResponse } from "@/types/ai";
import { AIService } from "./ai.service";

export class ResponseGenerateService {
  constructor(
    private readonly aiService: AIService,
    private readonly systemPrompts: string
  ) {
    this.aiService = aiService;
  }

  async generateResponse(
    messages: {
      user: string;
      content: string;
    }[],
    detectedTopics: string,
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    const messageContext = messages
      .map((msg) => `${msg.user}: ${msg.content}`)
      .join("\n");
    const debug = false;

    debug && console.log(messageContext, "messageContext");
    debug && console.log(detectedTopics, "detectedTopics");
    const response = await this.aiService.generateResponse(
      [
        { role: "system", content: this.systemPrompts },
        {
          role: "user",
          content: `Given the following conversation and detected topics:

Conversation:
${messageContext}

Detected Topics:
${detectedTopics}

Dựa vào các topic đã được phân tích, chọn topic được nhắc đến nhiều nhất, generate một câu trả lời để tiếp tục conversation

## REMEMBER
- Ưu tiên các topic call kèo, check meme, xác thực một cái gì đó
- Ưu tiên các topic về Finance, cryptocurency, stock market
- Do not repeat content included in Conversation
- Do not repeat request any question in Conversation
- KHÔNG DÙNG LẠI CÁC CÁC TỪ NGỮ CHỨA TRONG CONVERSATION
- KHÔNG DÙNG LẠI CÁC CÁC TỪ NGỮ CHỨA TRONG CONVERSATION
- KHÔNG DÙNG LẠI CÁC CÁC TỪ NGỮ CHỨA TRONG CONVERSATION

`.trim(),
        },
      ],
      {
        ...options,
        temperature: 0.7,
      }
    );

    debug && console.log(response, "✅ - response");

    return response;
  }
}
