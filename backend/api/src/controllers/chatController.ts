import { Request, Response } from "express";
import { chatServices } from "../services/chatService";
import { IAPIResponse } from "../interfaces/api";
import { ErrorApi } from "../errors/ErrorApi";
import { IMessage } from "../interfaces/message";

export const chatController = {
  getChatResponse: async (req: Request, res: Response) => {
    const { message, chatId } = req.body;
    const userId = req.user as string;

    if (!message || !chatId) {
      res.status(400).send("Message and chatId are required");
      return;
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    try {
      const result = chatServices.sendMessage(userId, chatId, message);
      for await (const chunk of result) {
        res.write(chunk);
      }
    } catch (error: any) {
      console.error("Erro ao processar a requisição:", error);
      res.write("data: [ERROR]\n\n");
    } finally {
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

  getChatById: async (req: Request, res: Response) => {
    try {
      const chatId = req.params.chatId;
      const response: IAPIResponse<IMessage[]> = { success: false };

      if (!chatId) {
        res.status(400).send("O chatId é obrigatório.");
        return;
      }

      const result: IMessage[] = await chatServices.getChatById(chatId);

      response.success = true;
      response.data = result;
      response.message = "Chat recuperado com sucesso.";

      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao recuperar o chat:", error);
      if (error instanceof ErrorApi) {
        res.status(error.status).send(error.message);
        return;
      }
      res.status(500).send("Erro ao recuperar o chat.");
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

  updateChatTitle: async (req: Request, res: Response) => {
    try {
      const chatId = req.params.chatId;
      const title = req.body.title;
      const response: IAPIResponse<IMessage[]> = { success: false };

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
      const response: IAPIResponse<IMessage[]> = { success: false };

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
  },

  getAllChats: async (req: Request, res: Response) => {
    // Implementar se necessário
  },

  // sendMessage: async (req: Request, res: Response) => {
  //   const response: IAPIResponse<string> = { success: false };
  //   const { message, chatId } = req.body;
  //   const userId = req.user;

  //   if (!userId) {
  //     res.status(401).json({ error: "Usuário não autenticado" });
  //     return;
  //   }

  //   if (!chatId) {
  //     res.status(400).json({ error: "Chat ID não fornecido" });
  //     return;
  //   }

  //   if (!message) {
  //     res.status(400).json({ error: "Mensagem não fornecida" });
  //     return;
  //   }

  //   try {
  //     const result: string = await chatServices.sendMessage(
  //       userId,
  //       chatId,
  //       message
  //     );

  //     response.success = true;
  //     response.message = result;

  //     return res.json({ response });
  //   } catch (error) {
  //     console.error("Erro ao processar a pergunta:", error);
  //     return res.status(500).json({ error: "Erro ao processar a pergunta" });
  //   }
  // },
};
