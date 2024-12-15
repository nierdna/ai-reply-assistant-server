import { Message } from "@/types/assistant";

export class Conversation {
  private history: Message[] = [];

  constructor(private initialSystemPrompt: string) {
    this.initialize();
  }

  private initialize(): void {
    this.history = [
      {
        role: "system",
        content: this.initialSystemPrompt,
      },
    ];
  }

  addMessage(role: "user" | "assistant", content: string): void {
    this.history.push({ role, content });
  }

  getHistory(): Message[] {
    return [...this.history];
  }

  clear(): void {
    this.initialize();
  }
}
