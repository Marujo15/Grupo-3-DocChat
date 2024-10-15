import { Response } from 'express';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CallbackManager } from 'langchain/callbacks';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import dotenv from 'dotenv';

dotenv.config();

const systemPrompt = process.env.SYSTEM_PROMPT;

export const handleChatRequest = async (message: string, res: Response) => {
  const callbackManager = CallbackManager.fromHandlers({
    async handleLLMNewToken(token: string) {
      res.write(`data: ${token}\n\n`);
    },
    async handleLLMEnd() {
      res.write('data: [END]\n\n');
      res.end();
    },
    async handleLLMError(e: Error) {
      console.error(e);
      res.write('data: [ERROR]\n\n');
      res.end();
    },
  });

  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
    callbackManager,
    modelName: 'gpt-4',
  });

  await chat.call([
    new SystemMessage(systemPrompt || 'Você é um assistente útil que responde às perguntas dos usuários de forma clara e concisa.'), // Usando o prompt do .env ou um fallback opcional
    new HumanMessage(message),
  ]);
};
