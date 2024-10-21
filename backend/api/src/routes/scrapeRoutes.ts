import { Router } from 'express';
import scrapeController from '../controllers/scrapeController';

const router = Router();

router.post('/', scrapeController.scrapeController);

export default router;