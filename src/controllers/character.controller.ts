import { CharacterManager } from '@/services/character-manager.service';
import { Controller, Post, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

// DTOs
class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The tone of the character",
    example: "friendly and helpful",
  })
  tone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The style/personality of the character",
    example: "friendly and helpful",
  })
  style: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The purpose/role of the character",
    example: "technical support assistant",
  })
  purpose: string;
}

class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The user message/prompt",
    example: "How can I deploy a Node.js application?",
  })
  prompt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Unique identifier for the conversation",
    example: "chat-123",
  })
  chatId: string;
}

class CharacterParamDto {
  @IsUUID()
  @ApiProperty({
    description: "The unique identifier of the character",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;
}

class ConversationParamDto extends CharacterParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The unique identifier of the conversation",
    example: "chat-123",
  })
  chatId: string;
}

@Controller("characters")
@ApiTags("Characters")
export class CharacterController {
  constructor(private characterManager: CharacterManager) {}

  @Post()
  @ApiOperation({ summary: "Create a new character" })
  @ApiResponse({
    status: 201,
    description: "The character has been successfully created.",
  })
  async createCharacter(@Body() createCharacterDto: CreateCharacterDto) {
    return {
      status: HttpStatus.CREATED,
      message: "Character created successfully",
      data: await this.characterManager.createCharacter(
        createCharacterDto.tone,
        createCharacterDto.style,
        createCharacterDto.purpose
      ),
    };
  }

  @Post(":id/chat")
  @ApiOperation({ summary: "Send a message to a character" })
  @ApiResponse({
    status: 200,
    description: "The character response",
  })
  async chat(
    @Param() params: CharacterParamDto,
    @Body() chatRequestDto: ChatRequestDto
  ) {
    return {
      status: HttpStatus.OK,
      message: "Character response",
      data: await this.characterManager.generateResponse(
        params.id,
        chatRequestDto.chatId,
        chatRequestDto.prompt
      ),
    };
  }

  @Get(":id/conversation/:chatId")
  @ApiOperation({ summary: "Get conversation history" })
  @ApiResponse({
    status: 200,
    description: "The conversation history",
  })
  getConversation(@Param() params: ConversationParamDto) {
    return {
      status: HttpStatus.OK,
      message: "Conversation history",
      data: this.characterManager
        .getCharacter(params.id)
        .getConversation(params.chatId),
    };
  }
}