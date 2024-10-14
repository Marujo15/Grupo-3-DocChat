import React, { useState } from "react";
import "./ChatArea.css";
import Input from "../Input/Input";
import Button from "../Button/Button";

const ChatArea: React.FC = () => {
    const [url, setUrl] = useState("");
    const [question, setQuestion] = useState("");
    const [answer] = useState("");

    const handleScrape = async (event: React.FormEvent) => {
        event.preventDefault();
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
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAskQuestion = async (event: React.FormEvent) => {
        event.preventDefault();
        // Lógica para enviar a pergunta para a IA e obter a resposta
        // Atualize o estado `answer` com a resposta da IA
    };

    return (
        <div className="chat-area">
            <form onSubmit={handleScrape} className="input-button-container">
                <div className="input-with-button">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Digite aqui a url para carregar os dados"
                        className="user-input"
                        id="load-data-input"
                        pattern="https?://.+"
                        title="Por favor, insira uma URL válida começando com http:// ou https://"
                        required
                    />
                    <Button type="submit" id="load-data-btn" onClick={() => {}}>Carregar dados</Button>
                </div>
            </form>
            <form onSubmit={handleAskQuestion} className="input-button-container">
                <div className="input-with-button">
                    <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Como posso ajudar?"
                        className="user-input"
                    />
                    <Button type="submit" id="ask-button" className="ask-button" onClick={() => {}}>
                        Perguntar
                    </Button>
                </div>
            </form>
            <div className="input-container">
                <Input
                    value={answer}
                    onChange={() => {}}
                    readOnly
                    className="ai-input"
                />
            </div>

        </div>
    );
};

export default ChatArea;