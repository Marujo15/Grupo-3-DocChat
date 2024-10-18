import express from "express";
import { urlController } from "../controllers/urlController";
import { Router } from "express";

const router: Router = express.Router();

router.post("/", urlController.saveUrl);

export default router;
