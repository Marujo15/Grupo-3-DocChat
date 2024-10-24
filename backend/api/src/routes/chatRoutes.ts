import { Router } from "express";
import { chatController } from "../controllers/chatController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.get("/", chatController.getAllChatsByUserId);
router.post("/create", chatController.createChat);
router.patch("/:chatId", chatController.updateChatTitle);
router.delete("/:chatId", chatController.deleteChat);

router.post("/", authenticateJWT, chatController.getChatResponse);

export default router;
