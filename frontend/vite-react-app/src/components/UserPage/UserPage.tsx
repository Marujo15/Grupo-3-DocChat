import React, { useEffect, useState } from "react";
import { ChatCard } from "../../interfaces/ChatInterfaces";
import { UserPageProps } from "../../interfaces/UserPageinterfaces.ts";
import Button from "../Button/Button";
import Header from "../Header/Header";
import Input from "../Input/Input";
import { deleteChat, getAllChats, updateChatTitle } from "../../utils/chatApi.ts";
import { formatDate } from "../../utils/formatDate.ts";
import { getUserData } from "../../utils/getUserData";
import "./UserPage.css";

const UserPage: React.FC<UserPageProps> = ({ userId }) => {
    const [userName, setUserName] = useState("");
    const [url, setUrl] = useState("");
    const [buttonText, setButtonText] = useState("Carregar dados");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [chats, setChats] = useState<ChatCard[]>([]);
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState("");
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [loadedUrls, setLoadedUrls] = useState<string[]>([
        "https://example.com",
        "https://example1.org",
        "https://example2.org",
        "https://example3.org",
        "https://example4.org",
        "https://example5.org",
        "https://example6.org",
    ]);

    useEffect(() => {
        const fetchChats = async () => {
            const chats = await getAllChats(userId);
            setChats(chats);
        };

        fetchChats();
    }, [userId, chats]);
    
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

    const handleDeleteChat = async (chatId: string) => {
        try {
            await deleteChat(chatId);
            setChats(chats);
            setShowDeleteConfirmation(true);
            setTimeout(() => {
                setShowDeleteConfirmation(false);
            }, 3000);
        } catch (error) {
            console.error("Erro ao deletar o chat:", error);
        }
    };

    const handleEditChat = (chatId: string, title: string) => {
        setEditChatId(chatId);
        setNewChatName(title);
    };

    // Function to scrape the URL and load the data
    const handleScrape = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if the URL is already loaded
        if (loadedUrls.includes(url)) {
            setErrorMessage("Esta URL já foi carregada.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return;
        }

        setIsLoading(true);
        setButtonText("Carregando...");
        setErrorMessage("");
        
        try {
            const response = await fetch("http://localhost:3000/api/scrape", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            console.log(data);
            setLoadedUrls((prevUrls) => [...prevUrls, url]);
            setUrl("");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
            setButtonText("Dados carregados!");
            setTimeout(() => {
                setButtonText("Carregar dados");
            }, 3000);
        }
    };

    const handleSaveChatName = async (chatId: string) => {
        try {
            await updateChatTitle(chatId, newChatName);
            setChats(chats);
            setShowUpdateConfirmation(true);
            setTimeout(() => {
                setShowUpdateConfirmation(false);
            }, 3000);
        } catch (error) {
            console.error("Erro ao modificar o título do chat:", error);
        }

        setEditChatId(null);
        setNewChatName("");
    };

    return (
        <>
            <Header variant="user" userName={userName} />
            <div className="user-page">
                <form onSubmit={handleScrape} className="input-button-container">
                    <div className="input-with-button">
                        <Input
                            value={url}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUrl(e.target.value)}
                            placeholder="Digite aqui a URL para carregar os dados"
                            className="user-input"
                            id="load-data-input"
                            pattern="https?://.+"
                            title="Por favor, insira uma URL válida começando com http:// ou https://"
                            required
                        />
                        <Button type="submit" id="load-data-btn" className="url-button" onClick={() => {}}>
                            {isLoading ? (
                                <div className="loading-container">
                                    <div className="spinner"></div>
                                    <span>{buttonText}</span>
                                </div>
                            ) : (
                                buttonText
                            )}
                        </Button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                <div id="sections-div">
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
                        {showDeleteConfirmation && (
                            <div className="delete-confirmation">
                                <p>Chat deletado com sucesso!</p>
                            </div>
                        )}
                        {showUpdateConfirmation && (
                            <div className="update-confirmation">
                                <p>Chat atualizado com sucesso com sucesso!</p>
                            </div>
                        )}
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
                                            <div className="chat-info-div">
                                                <span>{formatDate(chat.created_at)} </span>
                                                <span>{chat.title}</span>
                                            </div>
                                            <div className="action-buttons-up">
                                                <button className="edit-btn" onClick={() => handleEditChat(chat.id, chat.title)}>
                                                    <img src="/images/Vector.svg" alt="Renomear" />
                                                </button>
                                                <button className="delete-btn" onClick={() => handleDeleteChat(chat.id)}>
                                                    <img src="/images/Trash_Full.svg" alt="Deletar" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default UserPage;