export interface ToneConfig {
  formality: 'casual' | 'professional' | 'friendly';
  style: 'concise' | 'detailed' | 'conversational';
  purpose: 'informative' | 'persuasive' | 'supportive';
}

export interface AssistantConfig {
  tone: ToneConfig;
  systemPrompt: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}