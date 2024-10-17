import type { Document } from "@langchain/core/documents";
import { vectorRepository } from "../repositories/vectorRepository";

export const vectorService = {
  addVector: async (
    documents: Document<Record<string, any>>[],
    ids?: string[]
  ) => {
    try {
      return await vectorRepository.addVector(documents, ids);
    } catch (err: any) {
      console.error(`Erro ao adicionar vetor no vector store: ${err.message}`);
      throw err;
    }
  },
};
