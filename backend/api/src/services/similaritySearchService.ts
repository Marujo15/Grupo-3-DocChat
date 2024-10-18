import { query } from "../database/database";

export const similaritySearchService = {
  searchSimilarDocuments: async (embeddedQuestion: number[]) => {
    try {
      const queryText = `
        SELECT content, vector <=> $1 AS difference
        FROM testlangchainjs
        WHERE vector <=> $1 < 0.6
        ORDER BY difference ASC;
        `;

      //   console.log(
      //     `numero de dimensões da embeddedQuestion: ${embeddedQuestion.length}`
      //   );
      //o número de dimensões da questão embedada tem que ser 1536, assim como eu tenho que assegurar que o número de dimensões dos vetores no banco de dados também têm que ter 1536 dimensões

      const formattedEmbedding = embeddedQuestion.join(",");

      //   console.log(
      //     `embeddedQuestion do similaritySearchService: ${embeddedQuestion}`
      //   );

      const results = await query(queryText, [`[${formattedEmbedding}]`]);
      return results.rows;
    } catch (err: any) {
      console.error(`Erro ao buscar documentos similares: ${err.message}`);
      throw err;
    }
  },
};
