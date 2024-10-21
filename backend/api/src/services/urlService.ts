import { v4 as uuid } from "uuid";
import { scrapeRepository } from "../repositories/scrapeRepository";
import { urlRepository } from "../repositories/urlRepository";
import { IUrl, IVector } from "../interfaces/url";
import { PageInfo } from "../interfaces/PageInfo";
import { vectorServices } from "./vectorService";
import { ErrorApi } from "../errors/ErrorApi";

export const urlServices = {
  saveUrl: async (userId: string, url: string) => {
    try {
      const usersUrls: string[] = await urlRepository.getUrlsByUserId(userId);

      // verifica se a url q ele passou esta dentro de usersUrls
      const alreadyHasUrl = usersUrls.includes(url);

      // se tiver entao retorne dizendo que a url ja esta cadastrada
      if (alreadyHasUrl) {
        throw new ErrorApi({
          message: "URL already registered for this user.",
          status: 400,
        });
      }

      // se nao tiver entao salve a url no repository
      console.log("aqui 1");

      const visited: Set<string> = new Set<string>();
      const scrapeResults: PageInfo[] = await scrapeRepository.processPage(
        url,
        visited
      );

      console.log("aqui 2");

      const urlsToSave: IUrl[] = scrapeResults.map((pageInfo) => ({
        id: uuid(),
        baseUrl: url,
        url: pageInfo.url,
        content: pageInfo.html, // Conteúdo HTML da página
      }));
      console.log("aqui 3");

      const vectorsToSave: IVector[] = await Promise.all(
        urlsToSave.flatMap((URL) => {
          console.log(`URL to create chunks: ${URL.url}`);

          // Dividindo o conteúdo da URL em chunks (processo síncrono)
          const chunks = vectorServices.splitIntoChunks(URL.content);
          console.log(
            `The URL: ${URL.url} has ${chunks.length} chunks to save`
          );

          // Para cada chunk, vetorizamos e retornamos as promessas de vetorização
          return chunks.map(async (chunk) => {
            const vector = await vectorServices.vectorizeString(chunk); // Assíncrono

            // Retorna a estrutura para salvar o vetor
            return {
              id: uuid(),
              urlId: URL.id,
              baseUrl: URL.baseUrl,
              content: chunk,
              vector: vector,
            };
          });
        })
      );
      console.log("aqui 4");

      const urlsIds = await urlRepository.saveUrls(urlsToSave);
      console.log("aqui 5");

      await urlRepository.saveVectors(vectorsToSave);
      console.log("aqui 6");

      await urlRepository.syncIdsOnUsersUrls(userId, urlsIds);
      console.log("aqui 7");

      return "Urls saved";
    } catch (error) {
      throw error;
    }
  },

  deleteUrl: async (userId: string, baseUrl: string) => {
    try {
      await urlRepository.removeUrlsByBaseUrl(userId, baseUrl);
      return "Urls and vectors deleted";
    } catch (error) {
      throw error;
    }
  },

  searchPagesByQuestion: async (
    question: string,
    userId: string,
    chatId: string,
    matchThreshold: number = 0,
    matchCount: number = 5
  ): Promise<string[]> => {
    try {
      const questionEmbedding = await vectorServices.vectorizeString(question);
      const documentationPages = await urlRepository.getPagesByEmbedding(
        questionEmbedding,
        userId,
        chatId,
        matchThreshold,
        matchCount
      );

      if (!documentationPages) {
        throw new ErrorApi({
          message: "No pages found matching the question.",
          status: 404,
        });
      }

      return documentationPages;
    } catch (error) {
      throw error;
    }
  },
};
