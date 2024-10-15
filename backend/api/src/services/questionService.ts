import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

export const questionService = {
  postToEmbedQuestion: async (question: string) => {
    try {
      const questionEmbedding = await embeddings.embedQuery(question);
      console.log(questionEmbedding);
    } catch (err: any) {
      console.error(
        `Erro ao gerar embedding da questão fornecida: ${err.message}`
      );
      throw err;
    }
  },
};
