import {
  CreateCharacterDto,
  CharacterParamDto,
  ChatRequestDto,
  ConversationParamDto,
} from "@/dtos/character.dto";
import { CharacterManager } from "@/services/character-manager.service";
import { Controller, Post, Body, Get, Param, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

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
        createCharacterDto.name,
        createCharacterDto.bio,
        createCharacterDto.age,
        createCharacterDto.gender,
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
