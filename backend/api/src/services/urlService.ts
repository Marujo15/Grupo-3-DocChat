import { v4 as uuid } from "uuid";
import { scrapeRepository } from "../repositories/scrapeRepository";
import { urlRepository } from "../repositories/urlRepository";
import { IUrl } from "../interfaces/url";

export const urlServices = {
  saveUrl: async (userId: string, url: string) => {
    const usersUrls: string[] = await urlRepository.getUrlsByUserId(userId);

    // verifica se a url q ele passou esta dentro de usersUrls
    const alreadyHasUrl = usersUrls.includes(url);

    // se tiver entao retorne dizendo que a url ja esta cadastrada
    if (alreadyHasUrl) {
      return "url already registered";
    }

    // se nao tiver entao salve a url no repository
    const visited = new Set<string>();
    const results = await scrapeRepository.processPage(url, visited);

    const urlsToSave: IUrl[] = results.map((pageInfo) => ({
      id: uuid(),
      baseUrl: url,
      url: pageInfo.url,
      content: pageInfo.html, // Conteúdo HTML da página
    }));

    const result1 = await urlRepository.saveUrls(urlsToSave);

    await urlRepository.syncIdsOnUsersUrls(userId, result1);

    return;

    // se nao tiver entao salve a url no repository
  },
};
