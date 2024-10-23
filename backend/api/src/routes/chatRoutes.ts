import { Router, Request, Response } from "express";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { OPENAI_API_KEY } from "../config";
import { chatController } from "../controllers/chatController";
import { urlServices } from "../services/urlService";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.get("/:userId", chatController.getChatById);
router.post("/create", chatController.createChat);
// router.patch("/:chatId", chatController.updateChatTitle);
// router.delete("/:chatId", chatController.deleteChat);

router.post("/", authenticateJWT, chatController.getChatResponse);

export default router;
