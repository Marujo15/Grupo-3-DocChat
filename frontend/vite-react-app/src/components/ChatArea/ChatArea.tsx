import React, { useState } from "react";
import "./ChatArea.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Message } from "../../interfaces/MessageInterfaces";

const ChatArea: React.FC = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [urls, setUrls] = useState([]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Function to ask a question to the AI
    const handleAskQuestion = async (event: React.FormEvent) => {
        event.preventDefault();

        // Adds the user question to the messages list
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: question }]);
        setQuestion("Como posso ajudar?");

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
            {urls.length > 0 && (
                <div className="dropdown-container">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        {isDropdownOpen ? "Esconder URLs carregadas" : "Mostrar URLs carregdas"}
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-list">
                            {urls.map((url, index) => (
                                <li key={index} className="dropdown-item">
                                    {url}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {/* Chat area */}
            { messages.length === 0 ? (
                <></>
            ) : (
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className={`bubble ${msg.sender}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form to send questions */}
            <form onSubmit={handleAskQuestion} className="input-button-container">
                <div className="input-with-button">
                    <Input
                        value={question}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setQuestion(e.target.value)}
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
