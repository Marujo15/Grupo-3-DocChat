import { processPage } from '../repositories/scrapeRepository';

const scrapeData = async (url: string) => {
  try {
    const visited = new Set<string>();
    const results = await processPage(url, visited);
    return results;
  } catch (error) {
    console.error('Error in scrapeService:', error);
    throw new Error('Failed to scrape data');
  }
};

export { scrapeData };