import { v4 as uuidv4 } from "uuid";
import type { Document } from "@langchain/core/documents";
import { vectorStore } from "../config/initVectorStore";

export const vectorRepository = {
  addVector: async (documents: Document[], ids?: string[]) => {
    try {
      if (!vectorStore) {
        throw new Error("Vector Store is not initialized");
      }

      if (!ids || ids.length !== documents.length) {
        ids = documents.map(() => uuidv4());
      }
      //se IDs não forem fornecidos, gera novos UUIDs para os documentos

      await vectorStore.addDocuments(documents, { ids });
      console.log("Documents added successfully");
    } catch (error) {
      console.error("Error adding documents to vector store:", error);
      throw error;
    }
  },
};
