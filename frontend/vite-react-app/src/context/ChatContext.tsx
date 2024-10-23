import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatCard } from "../interfaces/ChatInterfaces";

interface ChatContextProps {
    chats: ChatCard[];
    addChat: (chat: ChatCard) => void;
    currentChatId: string | null;
    setCurrentChatId: (id: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chats, setChats] = useState<ChatCard[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    const addChat = (chat: ChatCard) => {
        setChats((prevChats) => [...prevChats, chat]);
    };

    return (
        <ChatContext.Provider value={{ chats, addChat, currentChatId, setCurrentChatId }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};