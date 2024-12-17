import { Injectable } from "@nestjs/common";
import { AIService } from "./ai.service";
import { Conversation } from "./conversation.service";
import { Gender } from "@/constants/enum";
import { TopicAnalysisService } from "./topic-analysis.service";
import { ResponseGenerateService } from "./response-generate.service";
import { SYSTEM_PROMPTS } from "@/configs/ai.config";

@Injectable()
export class Character {
  private initialSystemPrompt: string;
  private conversations: Map<string, Conversation>;
  private topicAnalysisService: TopicAnalysisService;
  private responseGenerateService: ResponseGenerateService;

  constructor(
    private readonly name: string,
    private readonly bio: string,
    private readonly tone: string,
    private readonly style: string,
    private readonly purpose: string,
    private readonly age: number,
    private readonly gender: Gender,
    private readonly aiService: AIService
  ) {
    this.initialSystemPrompt = `
    You are ${this.name}, a ${this.age} year old ${this.gender} character
    ${SYSTEM_PROMPTS.RESPONSE_GENERATION}
    ${this.bio}

    Tone Instructions:
    ${this.tone}
    
    Style Instructions:
    ${this.style}

    Purpose Instructions:
    ${this.purpose}

    ### KNOWLEDGE ###
    ## **Các tiếng lóng của dân chơi crypto Việt Name**
    - Éo: nghĩa là không

    ## **Các từ viết tắt của dân chơi crypto Việt Name**
    - Ray: raydium (sàn dex trên solana)
    - được: đc
    - không: ko
    - như thế nào: ntn
    - rồi: r
    - người: ng
    - tôi: t
    - tao: t
    - em: e
    - mày: m
    - bạn: b

    ### REMEMBER ###
    - CHỈ TRẢ LỜI 1 Ý (1 CÂU TỰ SỰ HOẶC 1 CÂU HỎI)
    - Sử dụng các từ viết tắt thay cho các từ đầy đủ nếu có thể
    - Trả lời ngắn gọn, xúc tích, không dài dòng, chỉ trả lời trong 1 câu (Tối đa 2 ý và ngắt nhau bởi dấu phẩy cho câu trả lời)
    - Chứa tối đa 1 dấu phẩy để ngắt ý trong câu trả lời
    - Không ** ** để thể hiện cảm xúc
    - Không thêm các từ thể hiện sự thân mật như "nhé", các trợ từ như "nhất" vào câu trả lời
    - Không dùng từ văn viết ở trong câu như "đấy", "nhé", "vậy", "kìa", "thế", "đây"
    - Không chấm ở cuối câu
    - Luôn thể hiện sự bí ẩn, không rõ ràng
  `.trim();
    this.conversations = new Map<string, Conversation>();

    this.topicAnalysisService = new TopicAnalysisService(
      this.aiService,
      SYSTEM_PROMPTS.TOPIC_DETECTION
    );
    this.responseGenerateService = new ResponseGenerateService(
      this.aiService,
      this.initialSystemPrompt
    );
  }

  /**
   * Get the character's name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the character's bio
   */
  getBio(): string {
    return this.bio;
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
   * Get the character's age
   */
  getAge(): number {
    return this.age;
  }

  /**
   * Get the character's gender
   */
  getGender(): Gender {
    return this.gender;
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
   * Generate AI response to continue a conversation with topic detection and response generation
   * @param messages - User input messages
   * @returns Promise<string> - AI generated response
   */
  async generateResponseToContinueConversation(
    messages: {
      user: string;
      content: string;
    }[]
  ): Promise<string> {
    if (!messages?.length) {
      throw new Error("Messages cannot be empty");
    }

    try {
      const detectTopics =
        await this.topicAnalysisService.generateResponse(messages);

      const response = await this.responseGenerateService.generateResponse(
        messages,
        detectTopics.content
      );

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
