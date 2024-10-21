import { Request, Response } from "express";
import { urlServices } from "../services/urlService";
import { IAPIResponse } from "../interfaces/api";
import { ErrorApi } from "../errors/ErrorApi";

export const urlController = {
  saveUrl: async (req: Request, res: Response): Promise<void> => {
    interface RequestBody {
      url?: string;
    }

    try {
      const userId = req.user;
      const { url } = req.body as RequestBody;

      const response: IAPIResponse<string> = { success: false };

      if (!userId) {
        throw new ErrorApi({
          message: "User ID not found.",
          status: 401,
        })
      }

      if (!url) {
        throw new ErrorApi({
          message: "URL is required.",
          status: 400,
        });
      }

      const result: string = await urlServices.saveUrl(userId, url);

      response.success = true;
      response.message = result;

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ErrorApi) {
        res.status(error.status).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Failed to save URL." });
    }
  },

  deleteUrl: async (req: Request, res: Response): Promise<void> => {
    interface RequestBody {
      url: string;
    }

    const userId: string | undefined = req.user;
    const { url: baseUrl } = req.body as RequestBody;

    const response: IAPIResponse<string> = { success: false };

    if (!userId || !baseUrl) {
      res.status(400).json({ message: "User ID and URL ID are required." });
      return;
    }

    try {
      const result: string = await urlServices.deleteUrl(userId, baseUrl);

      response.success = true;
      response.message = result;

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ErrorApi) {
        res.status(error.status).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Failed to delete URL." });
    }
  },

  searchPagesByQuestion: async (req: Request, res: Response): Promise<void> => {
    interface RequestBody {
      question?: string;
      chatId?: string;
    }
    try {
      const userId: string | undefined = req.user;
      const { question, chatId } = req.body as RequestBody;

      if (!question) {
        throw new ErrorApi({
          message: "Question is required",
          status: 400,
        });
      }

      if (!userId) {
        throw new ErrorApi({
          message: "User ID is required",
          status: 400,
        });
      }

      if (!chatId) {
        throw new ErrorApi({
          message: "Chat ID is required",
          status: 400,
        });
      }

      const response: IAPIResponse<string[]> = { success: false };

      const urls: string[] = await urlServices.searchPagesByQuestion(
        question,
        userId,
        chatId
      );

      response.success = true;
      response.data = urls;

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ErrorApi) {
        res.status(error.status).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Failed to search for pages." });
    }
  },
};
