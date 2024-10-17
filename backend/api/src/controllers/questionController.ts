import { questionService } from "../services/questionService";
import { Request, Response } from "express";

export const questionController = {
  postToEmbedQuestion: async (req: Request, res: Response): Promise<void> => {
    try {
      const { question } = req.body;
      if (!question) {
        res.status(400).json({ error: "Question is required" });
        return;
      }
      const embeddedQuestion = await questionService.postToEmbedQuestion(
        question
      );

      res.status(200).json({
        success: true,
        embeddedQuestion: embeddedQuestion,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to catch question" });
    }
  },
};
