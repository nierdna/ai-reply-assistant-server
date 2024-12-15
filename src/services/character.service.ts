import { Injectable } from "@nestjs/common";
import { AIService } from "./ai.service";
import { Conversation } from "./conversation.service";

@Injectable()
export class Character {
  private initialSystemPrompt: string;
  private conversations: Map<string, Conversation>;

  constructor(
    private readonly tone: string,
    private readonly style: string,
    private readonly purpose: string,
    private readonly aiService: AIService
  ) {
    this.initialSystemPrompt = `
    Bạn là một dân chơi crypto người Việt Nam. Bạn là một member hoạt động rất tích cực trong một group bàn luận về crypto.

    Tone Instructions:
    Thân thiện, xưng hô bằng em và bác, không cần quá tôn trọng.
    Tham gia vào tương tác tự nhiên theo kiểu đối thoại, ngắn gọi và súc tích (luôn trả lời theo kiểu ngắn gọn cụ thể là một câu). Không thêm các từ thể hiện sự thân mật như "nhé", các trợ từ như "nhất" vào câu trả lời.
    Tán thưởng, khen ngợi

    ## **Các tiếng lóng của dân chơi crypto Việt Name**
    - Ko tu đờ munnn: phát âm của go to the moon
    - Éo: nghĩa là không

    ## **Các từ viết tắt của dân chơi crypto Việt Name**
    - Ray: raydium (sàn dex trên solana)
  `.trim();
    this.conversations = new Map<string, Conversation>();
  }

  /**
   * Get the character's tone
   */
  getTone(): string {
    return this.tone;
  }

  /**
   * Get the character's style
   */
  getStyle(): string {
    return this.style;
  }

  /**
   * Get the character's purpose
   */
  getPurpose(): string {
    return this.purpose;
  }

  /**
   * Create a new conversation
   * @param chatId - Unique identifier for the conversation
   * @returns string - The chat ID
   */
  createConversation(chatId: string): string {
    if (this.conversations.has(chatId)) {
      throw new Error(`Conversation with ID ${chatId} already exists`);
    }

    this.conversations.set(chatId, new Conversation(this.initialSystemPrompt));
    return chatId;
  }

  /**
   * Get or create a conversation
   * @param chatId - Unique identifier for the conversation
   * @returns Conversation
   */
  getConversation(chatId: string): Conversation {
    if (!this.conversations.has(chatId)) {
      this.conversations.set(
        chatId,
        new Conversation(this.initialSystemPrompt)
      );
    }

    return this.conversations.get(chatId) as Conversation;
  }

  /**
   * Get all conversations
   * @returns Map of all conversations
   */
  getAllConversations(): Map<string, Conversation> {
    return this.conversations;
  }

  /**
   * Generate AI response for a specific conversation
   * @param chatId - Unique identifier for the conversation
   * @param prompt - User input prompt
   * @returns Promise<string> - AI generated response
   */
  async generateResponse(chatId: string, prompt: string): Promise<string> {
    if (!prompt?.trim()) {
      throw new Error("Prompt cannot be empty");
    }

    const conversation = this.getConversation(chatId);
    conversation.addMessage("user", prompt);

    try {
      const response = await this.aiService.generateResponse(
        conversation.getHistory()
      );

      conversation.addMessage("assistant", response.content);
      return response.content;
    } catch (error: any) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  /**
   * Delete a conversation
   * @param chatId - Unique identifier for the conversation
   * @returns boolean - Whether the deletion was successful
   */
  deleteConversation(chatId: string): boolean {
    return this.conversations.delete(chatId);
  }
}
