import { pool } from '../database/database';
import { IMessage } from '../interfaces/message';

export const chatRepository = {
  createChat: async (id: string, userId: string, title: string, createdAt: string) => {
    const queryText = `
      INSERT INTO chats (id, user_id, title, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, title, created_at;
    `;
    const values = [id, userId, title, createdAt];
    const result = await pool.query(queryText, values);
    return result.rows[0];
  },

  getChatById: async (id: string) => {
    const queryText = `
      SELECT id, user_id, title, created_at
      FROM chats
      WHERE id = $1;
    `;
    const result = await pool.query(queryText, [id]);
    if (result.rows.length === 0) {
      throw new Error('Chat not found.');
    }
    return result.rows[0];
  },

  saveMessage: async (message: IMessage) => {
    const queryText = `
      INSERT INTO messages (id, chat_id, sender, content, tool_name, input, output, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    const values = [
      message.id,
      message.chatId,
      message.sender,
      message.content || null,
      message.tool_name || null,
      message.input || null,
      message.output || null,
      message.createdAt,
    ];
    await pool.query(queryText, values);
  },

  getMessagesByChatId: async (chatId: string): Promise<IMessage[]> => {
    const queryText = `
      SELECT id, chat_id, sender, content, tool_name, input, output, created_at
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC;
    `;
    const result = await pool.query(queryText, [chatId]);
    return result.rows;
  },
};
