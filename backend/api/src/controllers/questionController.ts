import { questionService } from "../services/questionService";
import { similaritySearchService } from "../services/similaritySearchService";
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
      // console.log(
      //   `embeddedQuestion do questionController: ${embeddedQuestion}`
      // );

      const similarDocs = await similaritySearchService.searchSimilarDocuments(
        embeddedQuestion
      );
      // similarDocs.forEach((doc) => {
      //   console.log(`Content: ${doc.content}, Difference: ${doc.similarity}`);
      // });

      res.status(200).json({
        success: true,
        similarDocuments: similarDocs,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process question" });
    }
  },
};
