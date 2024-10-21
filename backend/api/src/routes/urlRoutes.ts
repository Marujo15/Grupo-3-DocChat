import express from "express";
import { urlController } from "../controllers/urlController";
import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/", urlController.saveUrl);
router.get("/", urlController.getUrlsByUserId);
router.get("/:chatId", urlController.getUrlsByChatId);
router.get("/pages", urlController.searchPagesByQuestion);

export default router;
