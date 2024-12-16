import OpenAI from "openai";
import type { ChatCompletion } from "openai/resources";
import { BaseAIService } from "./base.service";
import { AIRequestOptions, AIResponse } from "@/types/ai";
import { Message } from "@/types/assistant";
import { ConfigService } from "@nestjs/config";
import { Inject } from "@nestjs/common";

export class AIService extends BaseAIService {
  private openai: OpenAI;

  constructor(@Inject(ConfigService) readonly configService: ConfigService) {
    super({
      apiKey: configService.get("ai.apiKey")!,
      baseURL: configService.get("ai.baseURL")!,
      model: configService.get("ai.model")!,
      defaultParams: {
        temperature: configService.get<number>("ai.temperature")!,
        maxTokens: configService.get<number>("ai.maxTokens")!,
      },
    });
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
    });
  }

  async generateResponse(
    messages: Message[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages,
        temperature:
          options.temperature ?? this.config.defaultParams.temperature,
        max_tokens: options.maxTokens ?? this.config.defaultParams.maxTokens,
        stream: false, // Ensure we always get a regular response, not a stream
      });

      return this.formatResponse(completion);
    } catch (error) {
      this.handleError(error);
    }
  }

  private formatResponse(completion: ChatCompletion): AIResponse {
    return {
      content: completion.choices[0].message.content || "",
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }
}
