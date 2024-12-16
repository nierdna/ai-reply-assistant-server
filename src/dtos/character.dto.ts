import { Gender } from "@/constants/enum";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

// DTOs
export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The username of the character",
    example: "john_doe",
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The name of the character",
    example: "John Doe",
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The bio of the character",
    example: "John Doe is a friendly and helpful person",
  })
  bio: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "The age of the character",
    example: 25,
  })
  age: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({
    description: "The gender of the character",
    example: Gender.MALE,
  })
  gender: Gender;

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

export class ChatRequestDto {
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

export class CharacterParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The username of the character",
    example: "john_doe",
  })
  username: string;
}

export class ConversationParamDto extends CharacterParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The unique identifier of the conversation",
    example: "chat-123",
  })
  chatId: string;
}

export class UpdateCharacterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The name of the character",
    example: "John Doe",
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The bio of the character",
    example: "John Doe is a friendly and helpful person",
    required: false,
  })
  bio?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: "The age of the character",
    example: 25,
    required: false,
  })
  age?: number;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    description: "The gender of the character",
    example: Gender.MALE,
    required: false,
  })
  gender?: Gender;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The tone of the character",
    example: "friendly and helpful",
    required: false,
  })
  tone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The style/personality of the character",
    example: "friendly and helpful",
    required: false,
  })
  style?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The purpose/role of the character",
    example: "technical support assistant",
    required: false,
  })
  purpose?: string;
}

export class GetCharactersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC";

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number = 10;
}
