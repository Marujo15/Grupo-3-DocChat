import React, { useState } from "react";
import "./ChatArea.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Message } from "../../interfaces";

const ChatArea: React.FC = () => {
    const [url, setUrl] = useState("");
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadedUrls, setLoadedUrls] = useState<string[]>([]);
    const [buttonText, setButtonText] = useState("Carregar dados");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    // Function to ask a question to the AI
    const handleAskQuestion = async (event: React.FormEvent) => {
        event.preventDefault();

        // Adds the user question to the messages list
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: question }]);
        setQuestion("Carregando...");

        try {
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: question }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const data = await response.json();

            // Adds the AI response to the messages list
            setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: data.response }]);

        } catch (error) {
            console.error("Erro ao fazer a requisição:", error);
        }
    };

    return (
        <div className="chat-area">
            {/* Form to load url */}
            <form onSubmit={handleScrape} className="input-button-container">
                <div className="input-with-button">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
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

            {/* loaded url message */}
            {loadedUrls.length > 0 && (
                <div className="url-loaded-message">
                    {loadedUrls.map((loadedUrl, index) => (
                        <p key={index}>
                            Url <a href={loadedUrl} target="_blank" rel="noopener noreferrer">{loadedUrl}</a> carregada!
                        </p>
                    ))}
                </div>
            )}

            {/* Chat area */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className={`bubble ${msg.sender}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form to send questions */}
            <form onSubmit={handleAskQuestion} className="input-button-container">
                <div className="input-with-button">
                    <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Como posso ajudar?"
                        className="user-input"
                        id="ask-input"
                    />
                    <Button type="submit" id="ask-button" className="ask-button" onClick={() => {}}>
                        Perguntar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatArea;
