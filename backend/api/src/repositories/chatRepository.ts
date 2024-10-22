import { pool } from "../database/database";
import { IMessage } from "../interfaces/message";

export const chatRepository = {
  createChat: async (userId: string, title: string) => {
    const query = `
      INSERT INTO chats (user_id, title, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, user_id, title, created_at;
    `;
    const result = await pool.query(query, [userId, title]);
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
      throw new Error("Chat not found.");
    }
    return result.rows[0];
  },

  saveMessage: async (message: IMessage) => {
    const queryText = `
      INSERT INTO messages (chat_id, sender, content, tool_name, created_at)
      VALUES ($1, $2, $3, $4, $5);
    `;
    const values = [
      message.chatId,
      message.sender,
      message.content || null,
      message.tool_name || null,
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

  getAllChatsByUserId: async (userId: string) => {
    const query = `
      SELECT id, user_id, title, created_at
      FROM chats
      WHERE user_id = $1
      ORDER BY created_at;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
  },

  updateChatTitle: async (id: string, title: string) => {
    const query = `
            UPDATE chats
            SET title = $2
            WHERE id = $1
            RETURNING id, user_id, title, created_at
        `;

    const result = await pool.query(query, [id, title]);

    if (!result.rows.length) {
      throw new Error("Chat not found.");
    }

    return result.rows[0];
  },

  deleteChat: async (id: string) => {
    const query = `
            DELETE FROM chats
            WHERE id = $1
            RETURNING id
        `;

    const result = await pool.query(query, [id]);
  },
};
