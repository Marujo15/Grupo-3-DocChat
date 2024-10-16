import { Request, Response } from 'express';
import { scrapeData } from '../services/scrapeService';

const scrapeController = async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const data = await scrapeData(url);
        res.json(data);
    } catch (error) {
        console.error('Error in scrapeController:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
};

export default { scrapeController };