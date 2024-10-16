import { Router, Request, Response } from 'express';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    try {
        const chat = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const response = await chat.call([
            new HumanMessage(message),
        ]);

        return res.json({ response: response.text });
    } catch (error) {
        console.error('Erro ao processar a pergunta:', error);
        return res.status(500).json({ error: 'Erro ao processar a pergunta' });
    }
});

export default router;
