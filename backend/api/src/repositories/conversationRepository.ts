// import { pool } from "../database/database";
// import { IMessage } from "../interfaces/message";

// export const conversationRepository = {
//   addMessage: async (message: IMessage): Promise<void> => {
//     const query = `
//       INSERT INTO messages (id, chat_id, sender, content, created_at)
//       VALUES ($1, $2, $3, $4, $5)
//     `;
//     const values = [
//       message.id,
//       message.chatId,
//       message.sender,
//       message.message,
//       message.createdAt,
//     ];

//     try {
//       await pool.query(query, values);
//     } catch (error: any) {
//       console.error("Erro ao adicionar mensagem:", error.message);
//       throw new Error("Falha ao adicionar mensagem.");
//     }
//   },
// };
