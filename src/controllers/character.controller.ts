import {
  CreateCharacterDto,
  CharacterParamDto,
  ChatRequestDto,
  ConversationParamDto,
  UpdateCharacterDto,
  GetCharactersQueryDto,
} from "@/dtos/character.dto";
import { CharacterManager } from "@/services/character-manager.service";
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  Put,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

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
        createCharacterDto.username,
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

  @Post(":username/chat")
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
        params.username,
        chatRequestDto.chatId,
        chatRequestDto.prompt
      ),
    };
  }

  @Get(":username/conversation/:chatId")
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
        .getCharacter(params.username)
        .getConversation(params.chatId),
    };
  }

  @Put(":username")
  @ApiOperation({ summary: "Update an existing character" })
  @ApiResponse({
    status: 200,
    description: "The character has been successfully updated.",
  })
  async updateCharacter(
    @Param() params: CharacterParamDto,
    @Body() updateCharacterDto: UpdateCharacterDto
  ) {
    return {
      status: HttpStatus.OK,
      message: "Character updated successfully",
      data: await this.characterManager.updateCharacter(
        params.username,
        updateCharacterDto.name,
        updateCharacterDto.bio,
        updateCharacterDto.age,
        updateCharacterDto.gender,
        updateCharacterDto.tone,
        updateCharacterDto.style,
        updateCharacterDto.purpose
      ),
    };
  }

  @Get()
  @ApiOperation({ summary: "Get all characters" })
  @ApiResponse({
    status: 200,
    description: "Return all characters with pagination",
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search by character name",
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    description: "Field to sort by",
  })
  @ApiQuery({ name: "sortOrder", required: false, enum: ["ASC", "DESC"] })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  async getAllCharacters(@Query() query: GetCharactersQueryDto) {
    const { characters, total } = await this.characterManager.getAllCharacters(
      query.search,
      query.sortBy,
      query.sortOrder,
      query.page,
      query.limit
    );

    return {
      status: HttpStatus.OK,
      message: "Characters retrieved successfully",
      data: {
        characters,
        pagination: {
          total,
          page: query.page,
          limit: query.limit,
          totalPages: Math.ceil(total / query.limit),
        },
      },
    };
  }
}
