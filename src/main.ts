import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Enable CORS
  app.enableCors({
    origin: "*",
  });

  // Use Pino Logger
  // app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Ai Reply Assistant")
    .setDescription("Ai Reply Assistant API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(Number(process.env.PORT || 3000));

  console.log(`🚀 - Server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();