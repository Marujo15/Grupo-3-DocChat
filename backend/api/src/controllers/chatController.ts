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
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const userId = req.user;
      const chat = await chatServices.createChat(userId);
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  },

  getAllChatsByUserId: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const userId = req.user;
      const chats = await chatServices.getAllChatsByUserId(userId);
      res.status(200).json(chats);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
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

  updateChatTitle: async (req: Request, res: Response) => {
    try {
      const chatId = req.params.chatId;
      const title = req.body.title;
      const response: IAPIResponse<IMessage[]> = {success: false};

      if (!chatId || !title) {
        res.status(400).send("The chatId and title are required");
        return;
      }
      const result = await chatServices.updateChatTitle(chatId, title);

      response.success = true; 
      response.data = result; 
      response.message = "Chat updated";

      res.status(200).json(response);
    } catch (error) {
      console.error("Error updating chat:", error);
      if (error instanceof ErrorApi) {
        res.status(error.status).send(error.message);
        return;
      }
      res.status(500).send("Error updating chat");
    }
  },

  deleteChat: async (req: Request, res: Response) => {
    try {
      const chatId = req.params.chatId;
      const response: IAPIResponse<IMessage[]> = {success: false};

      if (!chatId) {
        res.status(400).send("The chatId is required");
        return;
      }

      const result = await chatServices.deleteChat(chatId);

      response.success = true; 
      response.message = "Chat deleted";

      res.status(200).json(response);
    } catch (error) {
      console.error("Error deleting chat:", error);
      if (error instanceof ErrorApi) {
        res.status(error.status).send(error.message);
        return;
      }
      res.status(500).send("Error deleting chat");
    }
  }
};
