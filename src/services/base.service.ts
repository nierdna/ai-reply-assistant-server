import { AIModelConfig, AIRequestOptions, AIResponse } from '@/types/ai';
import { Message } from '@/types/assistant';

export abstract class BaseAIService {
  protected config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  abstract generateResponse(
    messages: Message[],
    options?: AIRequestOptions
  ): Promise<AIResponse>;

  protected handleError(error: any): never {
    const message = error.response?.data?.error?.message || error.message;
    console.error('AI Service Error:', error);
    throw new Error(`AI Service Error: ${message}`);
  }
}