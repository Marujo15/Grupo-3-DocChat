import { ChatCard } from "../interfaces/ChatInterfaces";

const API_BASE_URL = "http://localhost:3000/api/chat";

export const getAllChats = async (): Promise<ChatCard[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Redirecting to Login Page.");
            return [];
        }
        const response = await fetch(`${API_BASE_URL}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Request Error: ${response.statusText}`);
        }

        const chats = await response.json();
        return chats;
    } catch (error) {
        console.error("Error when making the request:", error);
        return [];
    }
};

export const createNewChat = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Request error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting chat:", error);
    }
}

export const deleteChat = async (chatId: string): Promise<ChatCard[]> => {
    const response = await fetch(`${API_BASE_URL}/${chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    await response.json();
    return [];
};

export const updateChatTitle = async (chatId: string, newTitle: string): Promise<ChatCard[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${chatId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTitle }),
        });
        if (!response.ok) {
            throw new Error(`Request Error: ${response.statusText}`);
        }
        await response.json();
        return [];
    } catch (error) {
        console.error("Error updating chat title:", error);
        throw error;
    }
};
