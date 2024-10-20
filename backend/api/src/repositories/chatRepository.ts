import { pool } from "../database/database";

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
