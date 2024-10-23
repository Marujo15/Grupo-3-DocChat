export interface IMessage {
  id?: string;
  chatId: string;
  sender: "user" | "ia" | "tool_message";
  content: any;
  createdAt: string;
}

