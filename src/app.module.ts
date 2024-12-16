import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "./entities/character.entity";
import { CharacterController } from "./controllers/character.controller";
import { CharacterManager } from "./services/character-manager.service";
import { AIService } from "./services/ai.service";
import { aiConfig } from "./configs/ai.config";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forFeature(aiConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [Character],
        synchronize: true,
        ssl: configService.get("DB_HOST").includes("localhost")
          ? false
          : {
              rejectUnauthorized: false,
            },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Character]),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  controllers: [CharacterController],
  providers: [CharacterManager, AIService],
})
export class AppModule {}
