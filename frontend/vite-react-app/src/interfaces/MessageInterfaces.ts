export interface Message {
    sender: "user" | "ai";
    text: string;
    created_at: Date;
    chatId: string;
}