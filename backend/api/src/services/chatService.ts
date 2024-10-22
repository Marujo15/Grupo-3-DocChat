import { Response } from "express";
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  AIMessageChunk,
  MessageContent,
  SystemMessage,
} from "@langchain/core/messages";
import { z } from "zod";
import { chatRepository } from "../repositories/chatRepository";
import { IMessage } from "../interfaces/message";
import { createSearchDocumentationTool } from "../utils/tools";
import { OPENAI_API_KEY, SYSTEM_PROMPT } from "../config";
import { tool } from "@langchain/core/tools";
import { urlServices } from "./urlService";
import { ToolCall } from "@langchain/core/dist/messages/tool";
import { ErrorApi } from "../errors/ErrorApi";
import {
  BaseLanguageModel,
  BaseLanguageModelInput,
} from "@langchain/core/language_models/base";
import { concat } from "@langchain/core/utils/stream";
import { ChatAnthropic } from "@langchain/anthropic";
import { concat } from "@langchain/core/utils/stream";
import type { AIMessageChunk } from "@langchain/core/messages";

export const chatServices = {
  createChat: async (title: string, userId: string) => {
    // const id = uuid();
    const createdAt = new Date().toISOString();
    const result = await chatRepository.createChat(userId, title, createdAt);
    return { message: "Chat created", data: result };
  },

  getChatById: async (chatId: string): Promise<IMessage[]> => {
    const result: IMessage[] = await chatRepository.getMessagesByChatId(chatId);
    return result;
  },

  sendMessage: async (
    userId: string,
    chatId: string,
    message: string
  ): Promise<string> => {
    const docTool = tool(
      async ({ question }) => {
        const TheFiveMostRelevantPages =
          await urlServices.searchPagesByQuestion(question, userId, chatId);
        return TheFiveMostRelevantPages;
      },
      {
        name: "getTheFiveMostRelevantPages",
        schema: z.object({
          question: z.string(),
        }),
        description:
          "takes the five most relevant pages from the database according to the question sent by the user",
      }
    );

    const tools = [docTool];

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    const llmWithTools = llm.bindTools(tools);

    const humanMessage: IMessage = {
      chatId,
      sender: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    await chatRepository.saveMessage(humanMessage);

    const messages = [new HumanMessage(message)];

    const aiMessage: AIMessageChunk = await llmWithTools.invoke(messages);

    const toolsByName = {
      getTheFiveMostRelevantPages: docTool,
    };

    if (!!aiMessage.tool_calls) {
      for (const toolCall of aiMessage.tool_calls) {
        const selectedTool =
          toolsByName[toolCall.name as keyof typeof toolsByName];
        const toolMessage: ToolMessage = await selectedTool.invoke(toolCall);
        messages.push(toolMessage);

        const toolCallMessage: IMessage = {
          chatId,
          sender: "tool_call",
          content: JSON.stringify(toolCall),
          tool_name: toolCall.name,
          createdAt: new Date().toISOString(),
        };

        const toolMessageMessage: IMessage = {
          chatId,
          sender: "tool_message",
          content: JSON.stringify(toolMessage),
          tool_name: toolMessage.name,
          createdAt: new Date().toISOString(),
        };

        await chatRepository.saveMessage(toolCallMessage);
        await chatRepository.saveMessage(toolMessageMessage);
      }
    }

    const messagesHistory = await chatRepository.getMessagesByChatId(chatId);

    const newHumanMessages: HumanMessage[] = [
      /* criar array de mensagen do sender user */
    ];
    const newToolMessages: ToolMessage[] = [
      /* criar array de mensagens do sender tool_message */
    ];
    const newToolCallMessage: string[] = [
      // <- tem que estar nesse formato se n da erro
      /* criar array de mensagens do sender too_call */
    ];
    const newSystemMessages: SystemMessage[] = [
      /* criar array de mensagens do sender system */
    ];

    const newMessage: BaseLanguageModelInput = [
      // <- ordenar pelo tempo
      ...newHumanMessages,
      ...newToolMessages,
      ...newSystemMessages,
      ...newToolCallMessage,
    ];

    const finalMessage = await llmWithTools.invoke(newMessage);

    // ! Implementar stream ! //
    const coletado: AIMessageChunk | undefined = undefined;

    for await (const chunk of finalMessage) {
      if (coletado === undefined) {
        coletado = chunk;
      }
      else {
        coletado = concat (coletado, chunk);
      }
    }

    if (typeof finalMessage.content === "string") {
      return finalMessage.content;
    }
    throw new ErrorApi({
      message: "Failed to generate response.",
      status: 500,
    });
  },
};
