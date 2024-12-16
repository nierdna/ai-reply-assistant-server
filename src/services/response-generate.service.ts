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
    const response = await this.aiService.generateResponse(
      [
        { role: "system", content: this.systemPrompts },
        {
          role: "user",
          content: `Given the following conversation and detected topics:\n\nConversation:\n${messageContext}\n\nDetected Topics:\n${detectedTopics}\n\nGenerate a relevant response to continue the conversation:`,
        },
      ],
      options
    );
    return response;
  }
}
