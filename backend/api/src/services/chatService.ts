// src/services/chatService.ts

import { Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { OpenAI } from 'langchain/llms/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { chatRepository } from '../repositories/chatRepository';
import { IMessage } from '../interfaces/message';
import { createSearchDocumentationTool } from '../utils/tools';
import { SYSTEM_PROMPT } from '../config';
import { urlServices } from '../services/urlService';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const chatServices = {
  handleChatRequest: async (
    message: string,
    res: Response,
    chatId: string,
    userId: string,
    urls?: string[]
  ) => {
    const userMessage: IMessage = {
      id: uuid(),
      sender: 'user',
      content: message,
      createdAt: new Date().toISOString(),
      chatId,
    };
    await chatRepository.saveMessage(userMessage);

    const pastMessages = await chatRepository.getMessagesByChatId(chatId);

    if (urls && urls.length > 0) {
      for (const url of urls) {
        await urlServices.saveUrl(userId, url);
      }
    }

    const llm = new OpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4',
    });

    const tools = [createSearchDocumentationTool(userId)];

    const executor = await initializeAgentExecutorWithOptions(tools, llm, {
      agentType: 'zero-shot-react-description',
      verbose: true,
    });

    const historyMessages = pastMessages
      .map((msg) => `${msg.sender === 'user' ? 'Human' : 'AI'}: ${msg.content}`)
      .join('\n');

    const input = `${SYSTEM_PROMPT}\n${historyMessages}\nHuman: ${message}`;

    const response = await executor.call({ input });

    const aiMessageContent = response.output;

    const aiMessage: IMessage = {
      id: uuid(),
      sender: 'ia',
      content: aiMessageContent,
      createdAt: new Date().toISOString(),
      chatId,
    };
    await chatRepository.saveMessage(aiMessage);

    res.json({ message: aiMessageContent });
  },

  createChat: async (title: string, userId: string) => {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const result = await chatRepository.createChat(id, userId, title, createdAt);
    return { message: 'Chat created', data: result };
  },

  getChatById: async (chatId: string): Promise<IMessage[]> => {
    const result: IMessage[] = await chatRepository.getMessagesByChatId(chatId);
    return result;
  },
};
