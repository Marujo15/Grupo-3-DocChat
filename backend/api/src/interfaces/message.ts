import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  mapStoredMessageToChatMessage,
  ChatMessage,
  FunctionMessage,
  SystemMessage,
} from "@langchain/core/messages";

export interface IMessage {
  id?: string;
  chatId: string;
  sender: "user" | "ia" | "system" | "tool_message";
  content: string;
  createdAt?: string;
}

export interface IMessageStored {
  chatId: string;
  sender: "user" | "ia" | "system" | "tool_message";
  content:
    | HumanMessage
    | AIMessage
    | ToolMessage
    | ChatMessage
    | FunctionMessage
    | SystemMessage;
}
