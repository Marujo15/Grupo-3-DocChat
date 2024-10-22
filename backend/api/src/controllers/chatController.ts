import { Request, Response } from 'express';
import { chatServices } from '../services/chatService';
import { IAPIResponse } from '../interfaces/api';
import { ErrorApi } from '../errors/ErrorApi';
import { IMessage } from '../interfaces/message';

export const chatController = {
  getChatResponse: async (req: Request, res: Response) => {
    const { message, chatId, urls } = req.body;
    const userId = req.user as string;

    if (!message || !chatId) {
      res.status(400).send('Mensagem e chatId são obrigatórios.');
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await chatServices.handleChatRequest(message, res, chatId, userId, urls);
    } catch (error: any) {
      console.error('Erro ao processar a requisição:', error);
      res.write('data: [ERROR]\n\n');
      res.end();
    }
  },

  createChat: async (req: Request, res: Response) => {
    const response: IAPIResponse<string> = { success: false };
    const { title } = req.body;
    const userId = req.user as string;

    if (!title) {
      res.status(400).send('O título é obrigatório.');
      return;
    }

    if (!userId) {
      res.status(401).send('Usuário não autenticado.');
      return;
    }

    const result = await chatServices.createChat(title, userId);

    response.success = true;
    response.message = result.message;
    response.data = result.data;

    res.json(response);
  },

  getChatById: async (req: Request, res: Response) => {
    try {
      const chatId = req.params.chatId;
      const response: IAPIResponse<IMessage[]> = { success: false };

      if (!chatId) {
        res.status(400).send('O chatId é obrigatório.');
        return;
      }

      const result: IMessage[] = await chatServices.getChatById(chatId);

      response.success = true;
      response.data = result;
      response.message = 'Chat recuperado com sucesso.';

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao recuperar o chat:', error);
      if (error instanceof ErrorApi) {
        res.status(error.status).send(error.message);
        return;
      }
      res.status(500).send('Erro ao recuperar o chat.');
    }
  },

  getAllChats: async (req: Request, res: Response) => {
    // Implementar se necessário
  },
};