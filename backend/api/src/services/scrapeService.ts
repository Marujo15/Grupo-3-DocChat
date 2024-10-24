import { v4 as uuid } from "uuid";
import { PageInfo } from "../interfaces/PageInfo";
import { scrapeRepository } from "../repositories/scrapeRepository";
import { IUrl, IVector } from "../interfaces/url";
import { urlRepository } from "../repositories/urlRepository";

const scrapeData = async (url: string) => {
  try {
    const visited: Set<string> = new Set<string>();

    const results: PageInfo[] = await scrapeRepository.processPage(
      url,
      visited
    );

    return results;
  } catch (error) {
    console.error("Error in scrapeService:", error);
    throw new Error("Failed to scrape data");
  }
};

// const processScrapedData = async (
//   baseUrl: string
// ): Promise<{ urlsToSave: IUrl[]; vectorsToSave: IVector[] }> => {
//   const pageInfoArray: PageInfo[] = await scrapeData(baseUrl); // Faz a raspagem de dados

//   const urlsToSave: IUrl[] = pageInfoArray.map((pageInfo) => ({
//     id: uuid(),
//     baseUrl: baseUrl,
//     url: pageInfo.url,
//     content: pageInfo.html, // Conteúdo HTML da página
//   }));

//   const vectorsToSave: IVector[] = (
//     await Promise.all(
//       pageInfoArray.map(async (pageInfo) => {
//         const chunks = questionService.splitIntoChunks(pageInfo.html, 1000); // Divide o conteúdo em chunks de 1000 caracteres
//         const urlId = urlsToSave.find((url) => url.url === pageInfo.url)?.id!;

//         // Para cada chunk, cria um vetor e retorna os objetos
//         const vectorPromises = chunks.map(async (chunk) => {
//           const vector = await questionService.vectorizeString(chunk);

//           return {
//             id: uuid(),
//             urlId, // Encontra o id correspondente
//             url: pageInfo.url,
//             baseUrl: baseUrl,
//             content: chunk, // Armazena o chunk atual
//             vector: vector,
//           };
//         });

//         // Retorna as promessas para cada chunk
//         return Promise.all(vectorPromises);
//       })
//     )
//   ).flat(); // Achata o resultado final para um array plano

//   return { urlsToSave, vectorsToSave }; // Retorna urlsToSave e vectorsToSave
// };
export { scrapeData /* processScrapedData */ };
