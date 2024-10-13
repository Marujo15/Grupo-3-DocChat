import { Request, Response } from 'express';
import { scrapeService } from '../services/scrapeService';

export const scrapeController = {
  scrape: async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;
      if (!url) {
        res.status(400).json({ error: 'URL is required' });
        return;
      }
      const data = await scrapeService.scrapeData(url);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to scrape data' });
    }
  }
};