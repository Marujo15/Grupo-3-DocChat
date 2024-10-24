import { pool } from "../database/database";
import { ErrorApi } from "../errors/ErrorApi";
import { IMessage, IMessageStored } from "../interfaces/message";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  mapStoredMessageToChatMessage,
  StoredMessage,
} from "@langchain/core/messages";

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
      INSERT INTO messages (sender, content, chat_id) VALUES ($1, $2, $3)
    `;

    if (
      message instanceof HumanMessage ||
      message instanceof AIMessage ||
      message instanceof ToolMessage
    ) {
      await pool.query(query, [
        "user",
        JSON.stringify(message.toDict(), null, 2),
        chatId,
      ]);
    } else {
      throw new ErrorApi({
        message: "Invalid message type",
        status: 400,
      });
    }
  },

  getMessagesByChatId: async (chatId: string): Promise<IMessageStored[]> => {
    const query = `
      SELECT *
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC;
    `;

    const result = await pool.query(query, [chatId]);
    const IMessageArray = result.rows;

    return IMessageArray.map((message) => {
      return {
        chatId: message.chatId,
        sender: message.sender,
        content: mapStoredMessageToChatMessage(
          message.content as StoredMessage
        ),
      };
    });
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
        `;

    const result = await pool.query(query, [id]);
    return
  },
};
