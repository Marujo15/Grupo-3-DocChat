// src/services/chatService.ts

import { Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { OpenAI } from 'langchain/llms/openai';
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
    // Salvar a mensagem do usuário
    const userMessage: IMessage = {
      id: uuid(),
      sender: 'user',
      content: message,
      createdAt: new Date().toISOString(),
      chatId,
    };
    await chatRepository.saveMessage(userMessage);

    // Recuperar mensagens anteriores
    const pastMessages = await chatRepository.getMessagesByChatId(chatId);

    // Salvar URLs se fornecidas
    if (urls && urls.length > 0) {
      for (const url of urls) {
        await urlServices.saveUrl(userId, url);
      }
    }

    // Inicializar o modelo de linguagem
    const llm = new OpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4',
    });

    // Criar a ferramenta personalizada
    const searchTool = createSearchDocumentationTool(userId);

    let toolResponse = '';
    let shouldUseTool = false;

    // Lógica simples para decidir se deve usar a ferramenta
    // Por exemplo, se a mensagem contém a palavra "documentação"
    if (message.toLowerCase().includes('documentação')) {
      shouldUseTool = true;
      toolResponse = await searchTool.func(message);
    }

    // Construir o prompt para o LLM
    let prompt = `${SYSTEM_PROMPT}\n`;

    // Adicionar histórico de mensagens
    for (const msg of pastMessages) {
      prompt += `${msg.sender === 'user' ? 'Human' : 'AI'}: ${msg.content}\n`;
    }

    // Adicionar a nova mensagem do usuário
    prompt += `Human: ${message}\n`;

    // Se a ferramenta foi usada, incluir a resposta dela no prompt
    if (shouldUseTool) {
      prompt += `AI (usando a ferramenta ${searchTool.name}): ${toolResponse}\n`;
    }

    // Adicionar a instrução para o LLM gerar a resposta
    prompt += `AI:`;

    // Chamar o modelo de linguagem para gerar a resposta
    const aiMessageContent = await llm.call(prompt);

    // Salvar a mensagem da IA
    const aiMessage: IMessage = {
      id: uuid(),
      sender: 'ia',
      content: aiMessageContent,
      createdAt: new Date().toISOString(),
      chatId,
    };
    await chatRepository.saveMessage(aiMessage);

    // Enviar a resposta ao usuário
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
