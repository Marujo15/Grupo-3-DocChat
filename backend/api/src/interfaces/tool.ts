import { z } from "zod";

export const storeConversationSchema = z.object({
  chatId: z.string().uuid("chatId deve ser um UUID válido."),
  sender: z.enum(["user", "ia", "system"]),
  message: z.string().min(1, "O conteúdo da mensagem é obrigatório."),
  createdAt: z.string().optional(), // ISO string
});

export type StoreConversationInput = z.infer<typeof storeConversationSchema>;

export const similarityToolSchema = z.object({
  question: z.string().min(1, "A pergunta é obrigatória."),
});

export type SimilarityToolInput = z.infer<typeof similarityToolSchema>;
