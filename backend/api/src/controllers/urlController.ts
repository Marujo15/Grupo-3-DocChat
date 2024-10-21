import { Request, Response } from "express";
import { urlServices } from "../services/urlService";
import { IAPIResponse } from "../interfaces/api";
import { ErrorApi } from "../errors/ErrorApi";

export const urlController = {
  saveUrl: async (req: Request, res: Response): Promise<void> => {
    const userId = req.user;
    const { url } = req.body;

    const response: IAPIResponse<string> = { success: false };

    if (!userId || !url) {
      res.status(400).json({ message: "User ID and URL are required." });
      return;
    }

    try {
      const result: string = await urlServices.saveUrl(userId, url);

      response.success = true;
      response.message = result;

      res.status(200).json({ message: result });
    } catch (error) {
      if (error instanceof ErrorApi) {
        res.status(error.status).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "Failed to save URL." });
    }
  },
};
