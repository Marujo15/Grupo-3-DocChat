import React, { useState } from "react";
import "./ChatHistoryCard.css";
import { ChatHistoryCardProps } from "../../interfaces/ChatInterfaces.ts";
import { useNavigate } from "react-router-dom";

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ date, title, chatId, onEdit, onDelete }) => {
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleEditChat = (id: string, name: string) => {
        setIsEditing(true);
        setEditChatId(id);
        setNewChatName(name);
    };

    const handleSaveChatName = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/chat/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newChatName }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            setShowUpdateConfirmation(true);
            setTimeout(() => {
                setShowUpdateConfirmation(false);
            }, 3000);
        } catch (error) {
            console.error("Erro ao modificar o título do chat:", error);
        }
        onEdit(id, newChatName);
        setEditChatId(null);
        setIsEditing(false);
    };

    const handleDeleteClick = (id: string) => {
        setChatToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async (id: string) => {
        if (chatToDelete) {
            try {
                const response = await fetch(`http://localhost:3000/api/chat/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.statusText}`);
                }

                onDelete(chatToDelete);
                setShowDeleteConfirmation(true);
                setTimeout(() => {
                    setShowDeleteConfirmation(false);
                }, 3000);
            } catch (error) {
                console.error("Erro ao deletar o chat:", error);
            }
        }
        setShowModal(false);
        setChatToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
        setChatToDelete(null);
    };

    const handleCardClick = () => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="card" onClick={handleCardClick}>
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
                <button className="delete-btn" onClick={() => handleDeleteClick(chatId)}>
                    <img src="/images/Trash_Full.svg" alt="Deletar" />
                </button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Tem certeza de que deseja deletar este chat?</p>
                        <div id="user-choices-div">
                            <button onClick={() => handleConfirmDelete(chatId)}>Sim</button>
                            <button onClick={handleCancelDelete}>Não</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="delete-confirmation">
                    <p>Chat deletado com sucesso!</p>
                </div>
            )}
        </div>
    );
};

export default ChatHistoryCard;