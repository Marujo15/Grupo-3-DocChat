import express from "express";
import { Router } from 'express';
import { scrapeController } from '../controllers/scrapeController';

const router: Router = express.Router();

router.post('/', scrapeController.scrape);

export default router;