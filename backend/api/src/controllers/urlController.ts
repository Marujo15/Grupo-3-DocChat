import { Request, Response } from "express";
import { urlServices } from "../services/urlService";

export const urlController = {
  saveUrl: async (req: Request, res: Response): Promise<void> => {
    const userId = req.user;
    const { url } = req.body;

    if (!userId || !url) {
      res.status(400).json({ message: "User ID and URL are required." });
      return;
    }

    try {
      const savedUrl = await urlServices.saveUrl(userId, url);

      res.status(200).json({ message: savedUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to save URL." });
    }
  },
};
