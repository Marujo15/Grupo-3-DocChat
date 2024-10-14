import scrapeRepository from '../repositories/scrapeRepository';

export const scrapeService = {
  scrapeData: async (url: string): Promise<any> => {
    try {
      const html = await scrapeRepository.fetchHtml(url);
      const data = scrapeRepository.extractParagraphs(html);
      return data;
    } catch (error) {
      console.error('Error in scrapeService:', error);
      throw error;
    }
  }
};