import React, { useState } from "react";
import "./ChatArea.css";
import Input from "../Input/Input";
import Button from "../Button/Button";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatArea: React.FC = () => {
    const [url, setUrl] = useState("");
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    // Função para carregar dados da URL (pode ser usada para scraping)
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

    // Função para enviar a pergunta e obter a resposta da IA
    const handleAskQuestion = async (event: React.FormEvent) => {
        event.preventDefault();

        // Adiciona a pergunta à lista de mensagens
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: question }]);
        setQuestion("");

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

            // Adiciona a resposta da IA à lista de mensagens
            setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: data.response }]);

        } catch (error) {
            console.error("Erro ao fazer a requisição:", error);
        }
    };

    return (
        <div className="chat-area">
            {/* Formulário para carregar a URL */}
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
                        Carregar dados
                    </Button>
                </div>
            </form>

            {/* Área do chat */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className={`bubble ${msg.sender}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Formulário para enviar perguntas */}
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
        </div>
    );
};

export default ChatArea;
