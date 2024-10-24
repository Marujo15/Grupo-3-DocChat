export interface Message {
    sender: "user" | "ai";
    content: string;
    created_at: Date;
    chatId: string;
}