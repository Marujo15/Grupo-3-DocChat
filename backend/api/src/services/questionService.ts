import { OpenAIEmbeddings } from "@langchain/openai";
import { OPENAI_API_KEY } from "../config";

const embeddings = new OpenAIEmbeddings({
  apiKey: OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

export const questionService = {
  postToEmbedQuestion: async (question: string): Promise<number[]> => {
    try {
      const questionEmbedding = await embeddings.embedQuery(question);
      return questionEmbedding;
    } catch (err: any) {
      console.error(
        `Erro ao gerar embedding da questão fornecida: ${err.message}`
      );
      throw err;
    }
  },
};
