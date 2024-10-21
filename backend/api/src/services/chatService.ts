import { Response } from "express";
import dotenv from "dotenv";
import { chatRepository } from "../repositories/chatRepository";
import { IMessage } from "../interfaces/message";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { OPENAI_API_KEY, SYSTEM_PROMPT } from "../config";

dotenv.config();

const systemPrompt = SYSTEM_PROMPT;

export const chatServices = {
  handleChatRequest: async (message: string, res: Response) => {
    const callbackManager = CallbackManager.fromHandlers({
      async handleLLMNewToken(token: string) {
        res.write(`data: ${token}\n\n`);
      },

      async handleLLMEnd() {
        res.write("data: [END]\n\n");
        res.end();
      },

      async handleLLMError(e: Error) {
        console.error(e);
        res.write("data: [ERROR]\n\n");
        res.end();
      },
    });

    const chat = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      streaming: true,
      callbackManager,
      modelName: "gpt-4",
    });

    await chat.invoke([
      new SystemMessage(
        systemPrompt ||
          "Você é um assistente útil que responde às perguntas dos usuários de forma clara e concisa."
      ), // Usando o prompt do .env ou um fallback opcional
      new HumanMessage(message),
    ]);
  },

  createChat: async (userId: string) => {
    const title = "teste";
    const chat = await chatRepository.createChat(userId, title);
    return chat;
  },

  getAllChatsByUserId: async (userId: string) => {
    const result = await chatRepository.getAllChatsByUserId(userId);
    return result;
  },

  getChatById: async (chatId: string): Promise<IMessage[]> => {
    const result: IMessage[] = await chatRepository.getChatById(chatId);

    return [];
  },

  updateChatTitle: async (chatId: string, title: string) => {
    const result = await chatRepository.updateChatTitle(chatId, title);
    return result;
  },

  deleteChat: async (chatId: string) => {
    const result = await chatRepository.deleteChat(chatId);
    return result;
  }
};
