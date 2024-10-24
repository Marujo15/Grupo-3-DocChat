import React, { useEffect, useState } from "react";
import "./ChatArea.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Message } from "../../interfaces/MessageInterfaces";
import { useAuth } from "../../context/AuthContext";
import { getAllUrls } from "../../utils/urlApi";
import { ChatAreaProps } from "../../interfaces/ChatInterfaces";
import { Url } from "../../interfaces/UrlInterfaces";
import { getAllChats } from "../../utils/chatApi";

const ChatArea: React.FC<ChatAreaProps> = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [urls, setUrls] = useState<Url[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        if (user) {
          const data = await getAllUrls();
          setUrls(data);
        }
      } catch (error) {
        console.error("Error when making the request:", error);
      }
    };
    fetchUrls();
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isLoggedIn = !!user;

  // Function to ask a question to the AI
  const handleAskQuestion = async (event: React.FormEvent) => {
    event.preventDefault();

    // Pega o id do último chat do usuário
    const userChats = await getAllChats();
    const lastChatId = userChats[userChats.length - 1].id;

    // Adds the user question to the messages list
    const userMessage: Message = { sender: "user", text: question, created_at: new Date(), chatId: lastChatId };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuestion("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: question, chatId: lastChatId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedMessage = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedMessage += chunk;
        }
      }

      // Atualiza a última mensagem com o texto acumulado
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: accumulatedMessage, created_at: new Date(), chatId: lastChatId }
      ]);

    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  // Ordena as mensagens pelo campo created_at
  const sortedMessages = [...messages].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    return (
        <div className="chat-area">
                <div className="dropdown-container">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        {isDropdownOpen ? "Esconder URLs carregadas" : "Mostrar URLs carregdas"}
                    </button>
                    {isDropdownOpen && (
                        urls.length > 0 ? (
                            <ul className="dropdown-list">
                                {urls.map((url, index) => (
                                    <li key={index} className="dropdown-item">
                                        {`${url}`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhuma URL carregada! Para carregar url's vá para a <a href={isLoggedIn ? "/user" : "/login"}>Área do usuário</a>.</p>
                        )
                    )}
                </div>
                {/* Chat area */}
                {/* { messages.length === 0 ? ( */}
                    {/* <></> */}
                {/* ) : ( */}
                    <div className="chat-messages">
                        {sortedMessages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <div className={`bubble ${msg.sender}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
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
                {/* )} */}

        </div>
    );
};

export default ChatArea;
