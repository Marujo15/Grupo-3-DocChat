import { v4 as uuid } from 'uuid';
import { scrapeRepository } from '../repositories/scrapeRepository';
import { urlRepository } from '../repositories/urlRepository';
import { IUrl } from '../interfaces/url';
import { vectorServices } from './vectorService';

export const urlServices = {
  saveUrl: async (userId: string, url: string) => {
    const usersUrls: string[] = await urlRepository.getUrlsByUserId(userId);

    // Verifica se a URL já está cadastrada para o usuário
    const alreadyHasUrl = usersUrls.includes(url);

    if (alreadyHasUrl) {
      return 'URL already registered';
    }

    // Faz o scraping da URL
    const visited = new Set<string>();
    const results = await scrapeRepository.processPage(url, visited);

    // Prepara os dados para salvar
    const urlsToSave: IUrl[] = results.map((pageInfo) => ({
      id: uuid(),
      baseUrl: url,
      url: pageInfo.url,
      content: pageInfo.html,
    }));

    const urlIds = await urlRepository.saveUrls(urlsToSave);

    // Processa e salva os vetores
    for (const pageInfo of results) {
      const chunks = vectorServices.splitIntoChunks(pageInfo.html, 1000);
      const urlId = urlsToSave.find((u) => u.url === pageInfo.url)?.id!;

      const vectorPromises = chunks.map(async (chunk) => {
        const vector = await vectorServices.vectorizeString(chunk);
        await urlRepository.saveVector({
          id: uuid(),
          urlId,
          url: pageInfo.url,
          baseUrl: url,
          content: chunk,
          vector,
        });
      });

      await Promise.all(vectorPromises);
    }

    // Sincroniza os IDs na tabela users_urls
    await urlRepository.syncIdsOnUsersUrls(userId, urlIds);

    return;
  },
};
