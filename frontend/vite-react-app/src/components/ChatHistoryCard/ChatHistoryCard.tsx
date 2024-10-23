import React, { useState } from "react";
import "./ChatHistoryCard.css";
import { ChatHistoryCardProps } from "../../interfaces/ChatInterfaces.ts";
import { useNavigate } from "react-router-dom";
import { updateChatTitle, deleteChat } from "../../utils/chatApi.ts";

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ date, title, chatId, onEdit, onDelete }) => {
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const [showActionConfirmation, setShowActionConfirmation] = useState(false);
    const [actionMessage, setActionMessage] = useState("");

    const navigate = useNavigate();

    const handleEditChat = (id: string, name: string) => {
        setIsEditing(true);
        setEditChatId(id);
        setNewChatName(name);
    };

    const handleSaveChatName = async (id: string) => {
        try {
            await updateChatTitle(id, newChatName);

            setActionMessage("Chat atualizado com sucesso!");
            setShowActionConfirmation(true);
            setTimeout(() => {
                setActionMessage("");
                setShowActionConfirmation(false);
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

    const handleConfirmDelete = async () => {
        if (chatToDelete) {
            try {
                await deleteChat(chatToDelete);

                setActionMessage("Chat deletado com sucesso!");
                setShowActionConfirmation(true);
                setTimeout(() => {
                    setActionMessage("");
                    setShowActionConfirmation(false);
                }, 3000);
            } catch (error) {
                console.error("Erro ao deletar o chat:", error);
            }
        }
        if (chatToDelete) {
            onDelete(chatToDelete);
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
                {!isEditing && (
                <button className="edit-btn" onClick={() => handleEditChat(chatId, title)}>
                    <img src="/images/Vector.svg" alt="Renomear" />
                </button>
                )}
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
                            <button onClick={handleConfirmDelete}>Sim</button>
                            <button onClick={handleCancelDelete}>Não</button>
                        </div>
                    </div>
                </div>
            )}

            {showActionConfirmation && (
                <div className="action-msg-div">
                    <p>{actionMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ChatHistoryCard;