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

      const visited: Set<string> = new Set<string>();
      const scrapeResults: PageInfo[] = await scrapeRepository.processPage(
        url,
        visited
      );

      const urlsToSave: IUrl[] = scrapeResults.map((pageInfo) => ({
        id: uuid(),
        baseUrl: url,
        url: pageInfo.url,
        content: pageInfo.html, // Conteúdo HTML da página
      }));

      const vectorsToSave: IVector[] = await Promise.all(
        urlsToSave.flatMap((URL) => {

          const chunks = vectorServices.splitIntoChunks(URL.content);

          return chunks.map(async (chunk) => {
            const vector = await vectorServices.vectorizeString(chunk); // Assíncrono

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

      const urlsIds = await urlRepository.saveUrls(urlsToSave);

      await urlRepository.saveVectors(vectorsToSave);

      await urlRepository.syncIdsOnUsersUrls(userId, urlsIds);

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

  getUrlsByUserId: async (userId: string): Promise<string[]> => {
    try {
      const pages: string[] = await urlRepository.getUrlsByUserId(userId);

      if (!pages) {
        throw new ErrorApi({
          message: "Page not found.",
          status: 404,
        });
      }

      return pages;
    } catch (error) {
      throw error;
    }
  },

  getUrlsByChatId: async (chatId: string) => {
    try {
      const urls: string[] = await urlRepository.getUrlsByChatId(chatId);

      if (!urls) {
        throw new ErrorApi({
          message: "Page not found.",
          status: 404,
        });
      }

      return urls;
    } catch (error) {
      throw error;
    }
  },
};
