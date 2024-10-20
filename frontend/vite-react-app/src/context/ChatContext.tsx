import React, { createContext, useState, useContext } from "react";
import { ChatCard } from "../interfaces/ChatInterfaces";

interface ChatContextProps {
    chats: ChatCard[];
    addChat: (chat: ChatCard) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
    children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [chats, setChats] = useState<ChatCard[]>([]);

    const addChat = (chat: ChatCard) => {
        setChats((prevChats) => [...prevChats, chat]);
    };

    return (
        <ChatContext.Provider value={{ chats, addChat }}>
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