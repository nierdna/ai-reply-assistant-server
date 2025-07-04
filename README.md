# AI Reply Assistant Server

## Overview
The AI Reply Assistant Server is a NestJS-based backend application that allows the creation and management of AI-powered characters capable of conversational interactions. The system leverages OpenAI's API to generate contextually relevant responses based on character profiles and conversation history.

## Features
- **Character Management**: Create, update, and retrieve AI characters with custom personalities
- **Conversation Handling**: Generate contextually appropriate responses to user messages
- **Conversation History**: Store and retrieve conversation histories
- **Topic Analysis**: Analyze conversation topics to generate more relevant responses
- **RESTful API**: Well-documented API endpoints with Swagger integration

## Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Pino logger
- **AI Integration**: OpenAI API

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- PNPM package manager

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai-reply-assistant-server.git
   cd ai-reply-assistant-server
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=ai_assistant
   OPENAI_API_KEY=your_openai_api_key
   PORT=3000
   ```

4. Start the server
   ```bash
   # Development
   pnpm start:dev
   
   # Production
   pnpm build
   pnpm start:prod
   ```

## API Endpoints

### Characters
- `POST /characters` - Create a new character
- `GET /characters` - Get all characters (with pagination)
- `PUT /characters/:username` - Update an existing character

### Conversations
- `POST /characters/:username/chat` - Send a message to a character
- `POST /characters/:username/chat/conversation` - Send a full conversation to a character
- `GET /characters/:username/conversation/:chatId` - Get conversation history

## API Documentation
Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/docs
```

## Development

### Code Structure
- `src/controllers` - API endpoint definitions
- `src/services` - Business logic and service implementations
- `src/entities` - Database entity definitions
- `src/dtos` - Data Transfer Object definitions
- `src/configs` - Configuration settings

### Useful Commands
```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build
```

## License
MIT 