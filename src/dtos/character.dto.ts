import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The style/personality of the character',
    example: 'friendly and helpful'
  })
  style: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The purpose/role of the character',
    example: 'technical support assistant'
  })
  purpose: string;
}

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user message/prompt',
    example: 'How can I deploy a Node.js application?'
  })
  prompt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the conversation',
    example: 'chat-123'
  })
  chatId: string;
}

export class CharacterParamDto {
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier of the character',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;
}

export class ConversationParamDto extends CharacterParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the conversation',
    example: 'chat-123'
  })
  chatId: string;
}