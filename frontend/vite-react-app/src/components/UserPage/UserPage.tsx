import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/getUserData";
import Header from "../Header/Header";
import "./UserPage.css";
import { Chat } from "../../interfaces/ChatInterfaces.ts";
import Input from "../Input/Input";
import Button from "../Button/Button";

const UserPage: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [url, setUrl] = useState("");
    const [buttonText, setButtonText] = useState("Carregar dados");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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

    return (
        <>
            <Header variant="user" userName={userName} />

            <div className="user-page">
                <section>
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
                                        <div className="action-buttons-up">
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