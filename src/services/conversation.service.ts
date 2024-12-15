import { Message } from '@/types/assistant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Conversation {
  private messages: Array<Message> = [];

  addMessage(role: 'user' | 'assistant' | 'system', content: string) {
    this.messages.push({ role, content });
  }

  getMessages() {
    return this.messages;
  }
}