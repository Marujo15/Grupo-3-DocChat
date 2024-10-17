import express from "express";
import { Router } from "express";
import { questionController } from "../controllers/questionController";

const router: Router = express.Router();

router.post("/", questionController.postToEmbedQuestion);

export default router;
