import React, { useEffect, useState } from "react";
import { ChatCard } from "../../interfaces/ChatInterfaces";
import { Url } from "../../interfaces/UrlInterfaces.ts";
import { UserPageProps } from "../../interfaces/UserPageinterfaces.ts";
import Button from "../Button/Button";
import Header from "../Header/Header";
import Input from "../Input/Input";
import { deleteChat, getAllChats, updateChatTitle } from "../../utils/chatApi.ts";
import { deleteUrl, getAllUrls } from "../../utils/urlApi.ts";
import { formatDate } from "../../utils/formatDate.ts";
import { getUserData } from "../../utils/getUserData";
import "./UserPage.css";

const UserPage: React.FC<UserPageProps> = () => {
    const [userName, setUserName] = useState("");
    const [url, setUrl] = useState("");
    const [buttonText, setButtonText] = useState("Carregar dados");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showActionConfirmation, setShowActionConfirmation] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [chats, setChats] = useState<ChatCard[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [deleteType, setDeleteType] = useState<"chat" | "url" | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [reloadChats, setReloadChats] = useState(false);
    const [reloadUrls, setReloadUrls] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            const chats = await getAllChats();
            setChats(chats);
        };
        setReloadChats(false);
        
        fetchChats();
    }, [reloadChats]);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const data = await getAllUrls();
                console.log("data:", data);
                setUrls(data);
            } catch (error) {
                console.error("Error when making the request:", error);
            }
        };
        setReloadUrls(false);

        fetchUrls();
    }, [reloadUrls]);
    
    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData();
            if (data) {
                setUserName(data.userName);
            }
        };

        fetchUserData();
    }, []);

    // Function to scrape the URL and load the data
    const handleScrape = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if the URL is already loaded
        urls.forEach((loadedUrl) => {
            if (loadedUrl === url) {
                setErrorMessage("Esta URL já foi carregada.");
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
                return;
            }
        })

        setUrl("");

        await getAllUrls();

        setIsLoading(true);
        setButtonText("Carregando...");
        setErrorMessage("");
    };

    const handleDeleteUrl = (url: string) => {
        setDeleteType("url");
        setItemToDelete(url);
        setShowModal(true);
    };

    const handleDeleteChat = (chatId: string) => {
        setDeleteType("chat");
        setItemToDelete(chatId);
        setShowModal(true);
    };

    
    const handleConfirmDelete = async (itemToDelete: string) => {
        console.log("itemToDelete:", itemToDelete);
        console.log("deleteType:", deleteType);
            if (deleteType === "url" && itemToDelete) {
                try {
                    await deleteUrl(itemToDelete);
                    setUrls(urls.filter((url) => url !== itemToDelete));
                    setActionMessage("Url deletada com sucesso!");
                    setShowActionConfirmation(true);
                    setTimeout(() => {
                        setShowActionConfirmation(false);
                        setActionMessage("");
                    }, 3000);
                    setItemToDelete(null);
                    setReloadUrls(true);
                } catch (error) {
                    console.error("Erro ao deletar a URL:", error);
                    setErrorMessage("Erro ao deletar a URL.");
                }
            } else if (deleteType === "chat" && itemToDelete) {
                try {
                    await deleteChat(itemToDelete);
                    setItemToDelete(null);
                    setActionMessage("Chat deletado com sucesso!");
                    setShowActionConfirmation(true);
                    setTimeout(() => {
                        setShowActionConfirmation(false);
                        setActionMessage("");
                    }, 3000);
                    setReloadChats(true);
                } catch (error) {
                    console.error("Erro ao deletar o chat:", error);
                    setErrorMessage("Erro ao deletar o Chat.");
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 3000);
                }
            }
            setShowModal(false);
            setDeleteType(null);
            setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        console.log("itemToDelete:", itemToDelete);
        console.log("deleteType:", deleteType);
        setShowModal(false);
        setItemToDelete(null);
    };

    const handleEditChat = (chatId: string, title: string) => {
        setEditChatId(chatId);
        setNewChatName(title);
    };

    const handleSaveChatName = async (chatId: string) => {
        try {
            await updateChatTitle(chatId, newChatName);
            // setReloadChats(prev => !prev);
            setChats(chats);
            setReloadChats(true);
            setShowActionConfirmation(true);
            setActionMessage("Chat atualizado com sucesso!");
            setTimeout(() => {
                setShowActionConfirmation(false);
                setActionMessage("");
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
                            {urls.map((url, index) => (
                                <li key={index} className="loaded-url-item">
                                    <a href={`${url}`} target="_blank" rel="noopener noreferrer">
                                        {`${url}`}
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
                {showActionConfirmation && (
                    <div className="action-msg-div">
                        <p>{actionMessage}</p>
                    </div>
                )}

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>Tem certeza de que deseja deletar este chat?</p>
                            <div id="user-choices-div">
                                <button onClick={() => itemToDelete && handleConfirmDelete(itemToDelete)}>Sim</button>
                                <button onClick={handleCancelDelete}>Não</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserPage;