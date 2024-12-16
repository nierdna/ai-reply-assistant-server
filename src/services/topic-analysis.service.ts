import { AIRequestOptions, AIResponse } from "@/types/ai";
import { AIService } from "./ai.service";

export class TopicAnalysisService {
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
          content: `Analyze the following conversation and identify the main topics:\n${messageContext}`,
        },
      ],
      options
    );
    return response;
  }
}
