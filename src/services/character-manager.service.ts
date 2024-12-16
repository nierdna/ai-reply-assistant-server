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
        this.characters.set(entity.username, character);
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
    username: string,
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
      username,
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
    this.characters.set(username, character);

    return characterEntity;
  }

  async generateResponse(
    username: string,
    chatId: string,
    prompt: string
  ): Promise<string> {
    const character = this.characters.get(username);
    if (!character) {
      throw new Error(`Character with username ${username} not found`);
    }
    return character.generateResponse(chatId, prompt);
  }

  getCharacter(username: string): Character {
    const character = this.characters.get(username);
    if (!character) {
      throw new Error(`Character with username ${username} not found`);
    }
    return character;
  }

  async deleteCharacter(username: string): Promise<void> {
    // Soft delete from database
    await this.characterRepository.softDelete({ username });
    // Remove from memory
    this.characters.delete(username);
  }

  async updateCharacter(
    username: string,
    name?: string,
    bio?: string,
    age?: number,
    gender?: Gender,
    tone?: string,
    style?: string,
    purpose?: string
  ): Promise<CharacterEntity> {
    // Update character entity in database
    const characterEntity = await this.characterRepository.findOne({
      where: { username },
    });

    if (!characterEntity) {
      throw new Error(`Character with username ${username} not found`);
    }

    // Update only defined properties
    if (name !== undefined) characterEntity.name = name;
    if (bio !== undefined) characterEntity.bio = bio;
    if (age !== undefined) characterEntity.age = age;
    if (gender !== undefined) characterEntity.gender = gender;
    if (tone !== undefined) characterEntity.tone = tone;
    if (style !== undefined) characterEntity.style = style;
    if (purpose !== undefined) characterEntity.purpose = purpose;

    await this.characterRepository.save(characterEntity);

    // Update character instance in memory
    const character = new Character(
      characterEntity.name,
      characterEntity.bio,
      characterEntity.tone,
      characterEntity.style,
      characterEntity.purpose,
      characterEntity.age,
      characterEntity.gender,
      this.aiService
    );
    this.characters.set(username, character);

    return characterEntity;
  }

  async getAllCharacters(
    search?: string,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC",
    page: number = 1,
    limit: number = 10
  ): Promise<{ characters: CharacterEntity[]; total: number }> {
    const queryBuilder =
      this.characterRepository.createQueryBuilder("character");

    // Apply search filter if provided
    if (search) {
      queryBuilder.where("LOWER(character.name) LIKE LOWER(:search)", {
        search: `%${search}%`,
      });
    }

    // Apply sorting if provided
    if (sortBy) {
      // Validate sortBy field to prevent SQL injection
      const allowedSortFields = [
        "name",
        "age",
        "gender",
        "createdAt",
        "updatedAt",
      ];
      if (allowedSortFields.includes(sortBy)) {
        queryBuilder.orderBy(`character.${sortBy}`, sortOrder || "ASC");
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count before applying pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const characters = await queryBuilder.getMany();

    return {
      characters,
      total,
    };
  }
}
