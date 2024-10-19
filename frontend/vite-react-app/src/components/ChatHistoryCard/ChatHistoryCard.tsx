import React, { useState } from "react";
import "./ChatHistoryCard.css";
import { ChatHistoryCardProps } from "../../interfaces/ChatInterfaces.ts";

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ date, title, chatId, onEdit, onDelete }) => {
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const handleEditChat = (id: string, name: string) => {
        console.log("editando")
        setIsEditing(true);
        setEditChatId(id);
        setNewChatName(name);
    };

    const handleSaveChatName = (id: string) => {
        onEdit(id, newChatName);
        setEditChatId(null);
        setNewChatName("");
        setIsEditing(false);
    };

    return (
        <div className="card">
            <div className="card-info-div">
            <p>{date}</p>
            {editChatId === chatId ? (
                <>
                <input
                    type="text"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                />
                </>
            ) : (
                <h3>{title}</h3>
            )}
            </div>
            <div className="action-buttons">
            <button className="edit-btn" onClick={() => handleEditChat(chatId, title)}>
                <img src="/images/Vector.svg" alt="Renomear" />
            </button>
            {isEditing && (
                <button className="save-btn" onClick={() => handleSaveChatName(chatId)}>
                <img src="/images/Save.svg" alt="Renomear" />
                </button>
            )}
            <button className="delete-btn" onClick={() => onDelete(chatId)}>
                <img src="/images/Trash_Full.svg" alt="Deletar" />
            </button>
            </div>
        </div>
    );
};

export default ChatHistoryCard;