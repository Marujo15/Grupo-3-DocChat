import { ChatMessageHistory } from 'langchain/memory';
import { IMessage } from '../interfaces/message';
import { HumanMessage, AIMessage, SystemMessage } from 'langchain/schema';

export const loadMessageHistory = (messages: IMessage[]) => {
  const chatHistory = new ChatMessageHistory();

  messages.forEach((message) => {
    const content = message.content || '';

    switch (message.sender) {
      case 'user':
        chatHistory.addMessage(new HumanMessage(content));
        break;
      case 'ia':
        chatHistory.addMessage(new AIMessage(content));
        break;
      default:
        chatHistory.addMessage(new SystemMessage(content));
        break;
    }
  });

  return chatHistory;
};
