import { Request, Response } from 'express';
import { handleChatRequest } from '../services/chatService';

export const chatController = {
  getChatResponse: async (req: Request, res: Response) => {
    const message = req.query.message as string;

    if (!message) {
      res.status(400).send('Mensagem não fornecida.');
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await handleChatRequest(message, res);
    } catch (error: any) {
      console.error('Erro ao processar a requisição:', error);
      res.write('data: [ERROR]\n\n');
      res.end();
    }
  }
};
