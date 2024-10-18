import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/getUserData";
import Header from "../Header/Header";
import "./UserPage.css";
import { Chat } from "../../interfaces/index";

const UserPage: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [loadedUrls, setLoadedUrls] = useState<string[]>([
        "https://example.com",
        "https://example.org",
    ]);
    const [chats, setChats] = useState<Chat[]>([
        { id: "1", name: "Chat 1" },
        { id: "2", name: "Chat 2" },
    ]);
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData();
            if (data) {
                setUserName(data.userName);
            }
        };

        fetchUserData();
    }, []);

    const handleDeleteUrl = (url: string) => {
        setLoadedUrls((prevUrls) => prevUrls.filter((u) => u !== url));
    };

    const handleDeleteChat = (id: string) => {
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    };

    const handleEditChat = (id: string, name: string) => {
        setEditChatId(id);
        setNewChatName(name);
    };

    const handleSaveChatName = (id: string) => {
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === id ? { ...chat, name: newChatName } : chat
            )
        );
        setEditChatId(null);
        setNewChatName("");
    };

    return (
        <>
            <Header variant="user" userName={userName} />

            <div className="user-page">
                <section>
                    <h2 id="loaded-urls">URLs Carregadas</h2>
                    <ul>
                        {loadedUrls.map((url, index) => (
                            <li key={index} className="loaded-url-item">
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                                <button className="delete-btn" onClick={() => handleDeleteUrl(url)}>
                                <img src="/images/Trash_Full.svg" alt="Deletar" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 id="saved-chats">Chats Salvos</h2>
                    <ul>
                        {chats.map((chat) => (
                            <li key={chat.id} className="saved-chat-item">
                                {editChatId === chat.id ? (
                                    <>
                                        <input
                                            className="chat-name-input"
                                            type="text"
                                            value={newChatName}
                                            onChange={(e) => setNewChatName(e.target.value)}
                                        />
                                        <button className="save-btn" onClick={() => handleSaveChatName(chat.id)}>
                                            <img src="/images/Save.svg" alt="Salvar" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{chat.name}</span>
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => handleEditChat(chat.id, chat.name)}>
                                                <img src="/images/Vector.svg" alt="Renomear" />
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDeleteChat(chat.id)}>
                                                <img src="/images/Trash_Full.svg" alt="Deletar" />
                                            </button>
                                        </div>
                                    </>
                                )}
                                {editChatId === chat.id && (
                                    <div className="action-buttons">
                                        <button className="delete-btn" onClick={() => handleDeleteChat(chat.id)}>
                                            <img src="/images/Trash_Full.svg" alt="Deletar" />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
};

export default UserPage;