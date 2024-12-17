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

Generate a relevant response to continue popular topic in the conversation

## REMEMBER
Do not repeat content included in Conversation

`,
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
