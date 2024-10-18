export interface IMessage {
  sender: "user" | "ia" | "system";
  message: string;
  createdAt: string;
  chatId: string;
  userId: string;
}
