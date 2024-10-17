import { vectorService } from "../services/vectorService";
import { Request, Response } from "express";
import { Document } from "@langchain/core/documents";

export const vectorController = {
  addVector: async (req: Request, res: Response): Promise<void> => {
    try {
      const { documents, ids }: { documents: Document[]; ids?: string[] } =
        req.body;

      if (!documents || documents.length === 0) {
        res.status(400).json({ error: "Documents are required" });
        return;
      }

      await vectorService.addVector(documents, ids);

      res.status(200).json({ message: "Documents added successfully" });
    } catch (error) {
      console.error("Error adding vector:", error);
      res.status(500).json({ error: "Failed to add documents" });
    }
  },
};
