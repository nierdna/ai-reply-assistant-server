export interface AIModelConfig {
  model: string;
  baseURL: string;
  apiKey: string;
  defaultParams: {
    temperature: number;
    maxTokens: number;
  };
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}