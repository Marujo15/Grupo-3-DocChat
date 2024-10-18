import { pool } from "../database/database";

export const chatRepository = {
  createChat: async (
    id: string,
    userId: string,
    title: string,
    createdAt: string
  ) => {
    const query = `
            INSERT INTO chats (id, user_id, title, created_at)
            VALUES ($1, $2)
            RETURNING id, user_id, title, created_at;
        `;

    const result = await pool.query(query, [id, title, userId, createdAt]);
    return result.rows[0];
  },

  getChatById: async (id: string) => {
    const query = `
            SELECT id, chat_id, sender, content, created_at
            FROM messages
            WHERE chat_id = $1
            ORDER BY created_at
        `;

    const result = await pool.query(query, [id]);

    if (!result.rows.length) {
      throw new Error("Chat not found.");
    }

    return result.rows[0];
  },
};
