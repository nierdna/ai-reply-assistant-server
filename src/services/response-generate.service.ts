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
(nếu message cuối cùng của conversation cũng thuộc topic được nhắc đến, generate câu trả lời cho message cuối cùng)

## REMEMBER
- Ưu tiên các topic call kèo, check meme, xác thực một cái gì đó
- Ưu tiên các topic về Finance, cryptocurency, stock market
- KHÔNG BAO GIỜ ĐƯỢC LẶP LẠI Ý CỦA NGƯỜI KHÁC
- KHÔNG BAO GIỜ ĐƯỢC LẠI CÁC CÁC TỪ NGỮ CHỨA TRONG CONVERSATION
- Nếu không có topic nào được nhắn đến, than vãn một câu không rõ ràng. Ví dụ: "thị trường chán thật"
`.trim(),
        },
      ],
      {
        ...options,
        temperature: 0.8,
      }
    );

    debug && console.log(response, "✅ - response");

    return response;
  }
}
