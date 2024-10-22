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

export const chatServices = {
  handleChatRequest: async (
    message: string,
    res: Response,
    chatId: string,
    userId: string,
    urls?: string[]
  ) => {
    // Salvar a mensagem do usuário
    const userMessage: IMessage = {
      id: uuid(),
      sender: "user",
      content: message,
      createdAt: new Date().toISOString(),
      chatId,
    };
    await chatRepository.saveMessage(userMessage);

    // Recuperar mensagens anteriores
    const pastMessages = await chatRepository.getMessagesByChatId(chatId);

    // Salvar URLs se fornecidas
    if (urls && urls.length > 0) {
      for (const url of urls) {
        await urlServices.saveUrl(userId, url);
      }
    }

    // Inicializar o modelo de linguagem
    const llm = new OpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-4",
    });

    // Criar a ferramenta personalizada
    const searchTool = createSearchDocumentationTool(userId);

    let toolResponse = "";
    let shouldUseTool = false;

    // Lógica simples para decidir se deve usar a ferramenta
    // Por exemplo, se a mensagem contém a palavra "documentação"
    if (message.toLowerCase().includes("documentação")) {
      shouldUseTool = true;
      toolResponse = await searchTool.func(message);
    }

    // Construir o prompt para o LLM
    let prompt = `${SYSTEM_PROMPT}\n`;

    // Adicionar histórico de mensagens
    for (const msg of pastMessages) {
      prompt += `${msg.sender === "user" ? "Human" : "AI"}: ${msg.content}\n`;
    }

    // Adicionar a nova mensagem do usuário
    prompt += `Human: ${message}\n`;

    // Se a ferramenta foi usada, incluir a resposta dela no prompt
    if (shouldUseTool) {
      prompt += `AI (usando a ferramenta ${searchTool.name}): ${toolResponse}\n`;
    }

    // Adicionar a instrução para o LLM gerar a resposta
    prompt += `AI:`;

    // Chamar o modelo de linguagem para gerar a resposta
    const aiMessageContent = await llm.call(prompt);

    // Salvar a mensagem da IA
    const aiMessage: IMessage = {
      id: uuid(),
      sender: "ia",
      content: aiMessageContent,
      createdAt: new Date().toISOString(),
      chatId,
    };
    await chatRepository.saveMessage(aiMessage);

    // Enviar a resposta ao usuário
    res.json({ message: aiMessageContent });
  },

  createChat: async (userId: string) => {
    const title = "teste";
    const chat = await chatRepository.createChat(userId, title);
    return chat;
  },

  getChatById: async (chatId: string): Promise<IMessage[]> => {
    const result: IMessage[] = await chatRepository.getMessagesByChatId(chatId);
    return result;
  },
  getAllChatsByUserId: async (userId: string) => {
    const result = await chatRepository.getAllChatsByUserId(userId);
    return result;
  },

  updateChatTitle: async (chatId: string, title: string) => {
    const result = await chatRepository.updateChatTitle(chatId, title);
    return result;
  },

  deleteChat: async (chatId: string) => {
    const result = await chatRepository.deleteChat(chatId);
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

    if (typeof finalMessage.content === "string") {
      return finalMessage.content;
    }
    throw new ErrorApi({
      message: "Failed to generate response.",
      status: 500,
    });
  },
};
