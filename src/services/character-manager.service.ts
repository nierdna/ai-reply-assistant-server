import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Character as CharacterEntity } from "../entities/character.entity";
import { Character } from "./character.service";
import { AIService } from "./ai.service";
import { Gender } from "@/constants/enum";

@Injectable()
export class CharacterManager implements OnModuleInit {
  private characters: Map<string, Character>;

  constructor(
    @InjectRepository(CharacterEntity)
    private characterRepository: Repository<CharacterEntity>,
    private aiService: AIService
  ) {
    this.characters = new Map<string, Character>();
  }

  async onModuleInit() {
    await this.initializeCharacters();
  }

  private async initializeCharacters() {
    try {
      const characterEntities = await this.characterRepository.find();

      for (const entity of characterEntities) {
        const character = new Character(
          entity.name,
          entity.bio,
          entity.tone,
          entity.style,
          entity.purpose,
          entity.age,
          entity.gender,
          this.aiService
        );
        this.characters.set(entity.id, character);
      }

      console.log(
        `Initialized ${this.characters.size} characters from database`
      );
    } catch (error) {
      console.error("Failed to initialize characters:", error);
      throw error;
    }
  }

  async createCharacter(
    name: string,
    bio: string,
    age: number,
    gender: Gender,
    tone: string,
    style: string,
    purpose: string
  ): Promise<CharacterEntity> {
    // Create and save character entity
    const characterEntity = this.characterRepository.create({
      name,
      bio,
      age,
      gender,
      tone,
      style,
      purpose,
    });
    await this.characterRepository.save(characterEntity);

    // Create and store character instance
    const character = new Character(
      name,
      bio,
      tone,
      style,
      purpose,
      age,
      gender,
      this.aiService
    );
    this.characters.set(characterEntity.id, character);

    return characterEntity;
  }

  async generateResponse(
    characterId: string,
    chatId: string,
    prompt: string
  ): Promise<string> {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }
    return character.generateResponse(chatId, prompt);
  }

  getCharacter(characterId: string): Character {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }
    return character;
  }

  async deleteCharacter(characterId: string): Promise<void> {
    // Soft delete from database
    await this.characterRepository.softDelete(characterId);
    // Remove from memory
    this.characters.delete(characterId);
  }
}
