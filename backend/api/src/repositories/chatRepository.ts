import { pool } from "../database/database";
import { IMessage } from "../interfaces/message";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";

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

  saveMessage: async (
    message: HumanMessage | AIMessage | ToolMessage,
    chatId: string
  ) => {
    const query = `
      INSERT INTO messages (sender, content, chat_id, created_at) VALUES ($1, $2, $3, NOW())
    `;

    if (message instanceof HumanMessage) {
      await pool.query(query, [
        "user",
        {
          content: message.content,
        },
        chatId,
      ]);
    } else if (message instanceof AIMessage) {
      await pool.query(query, [
        "ia",
        {
          content: message.content,
          id: message.id,
          tool_calls: message.tool_calls,
          invalid_tool_calls: message.invalid_tool_calls,
          response_metadata: message.response_metadata,
          usage_metadata: message.usage_metadata,
        },
        chatId,
      ]);
    } else if (message instanceof ToolMessage) {
      await pool.query(query, [
        "tool_message",
        {
          content: message.content,
          name: message.name,
          response_metadata: message.response_metadata,
          tool_call_id: message.tool_call_id,
        },
        chatId,
      ]);
    } else {
      throw new Error(
        "Não é um tipo de mensagem conhecido, acho que isso é impossível"
      );
    }
  },

  getMessagesByChatId: async (chatId: string): Promise<IMessage[]> => {
    const query = `
      SELECT *
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC;
    `;
    const result = await pool.query(query, [chatId]);
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
