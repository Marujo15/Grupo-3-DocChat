import { Request, Response } from "express";
import { chatServices } from "../services/chatService";
import { IAPIResponse } from "../interfaces/api";
import { IMessage } from "../interfaces/message";
import { ErrorApi } from "../errors/ErrorApi";

export const chatController = {
  getChatResponse: async (req: Request, res: Response) => {
    const message = req.query.message as string;

    if (!message) {
      res.status(400).send("Mensagem não fornecida.");
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await chatServices.handleChatRequest(message, res);
    } catch (error: any) {
      console.error("Erro ao processar a requisição:", error);
      res.write("data: [ERROR]\n\n");
      res.end();
    }
  },

  createChat: async (req: Request, res: Response) => {
    const response: IAPIResponse<string> = { success: false };
    const { title } = req.body;
    const userId = req.user;

    if (!title) {
      res.status(400).send("The title is required");
      return;
    }

    if (!userId) {
      res.status(401).send("The userId is required");
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
      const response: IAPIResponse<IMessage[]> = {success: false};

      if (!chatId) {
        res.status(400).send("The chatId is required");
        return;
      }

      const result: IMessage[] = await chatServices.getChatById(chatId);

      response.success = true; 
      response.data = result; 
      response.message = "Chat created";

      res.status(200).json(response);
    } catch (error) {
      console.error("Error retrieving chat:", error);
      if (error instanceof ErrorApi) {
        res.status(error.status).send(error.message);
        return;
      }
      res.status(500).send("Error retrieving chat");
    }
  },

  getAllChats: async (req: Request, res: Response) => {},
};
