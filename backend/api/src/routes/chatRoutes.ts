import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { OPENAI_API_KEY } from "../config";
import { chatController } from "../controllers/chatController";

dotenv.config();

const router = Router();

router.get("/:userId", chatController.getAllChatsByUserId);
router.post("/create", chatController.createChat);
router.patch("/:chatId", chatController.updateChatTitle);
router.delete("/:chatId", chatController.deleteChat);

router.post("/", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem não fornecida" });
  }

  try {
    const chat = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
    });

    const response = await chat.invoke([new HumanMessage(message)]);

    return res.json({ response: response.text });
  } catch (error) {
    console.error("Erro ao processar a pergunta:", error);
    return res.status(500).json({ error: "Erro ao processar a pergunta" });
  }
});

export default router;
