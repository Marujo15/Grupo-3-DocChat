export interface IMessage {
  id?: string;
  chatId: string;
  sender: 'user' | 'ia' | 'system' | 'tool_call' | 'tool_message';
  content?: string;
  tool_name?: string;
  createdAt: string;
}
