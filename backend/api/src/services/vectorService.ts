import { OpenAIEmbeddings } from "@langchain/openai";
import { OPENAI_API_KEY } from "../config";

const embeddings = new OpenAIEmbeddings({
  apiKey: OPENAI_API_KEY,
});

export const vectorServices = {
  vectorizeString: async (text: string): Promise<number[]> => {
    try {
      const embed = await embeddings.embedQuery(text);

      return embed;
    } catch (err: any) {
      console.error(
        `Erro ao gerar embedding da string fornecida: ${err.message}`
      );
      throw err;
    }
  },

  splitIntoChunks: (content: string, chunkSize: number = 10000): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.substring(i, i + chunkSize));
    }
    return chunks;
  },
};
