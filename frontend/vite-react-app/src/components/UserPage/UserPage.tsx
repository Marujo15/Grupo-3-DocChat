import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/getUserData";
import Header from "../Header/Header";
import "./UserPage.css";

interface Chat {
  id: string;
  name: string;
}

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
    <div className="user-page">
      <Header variant="user" userName={userName} />
      <h1>Página do Usuário</h1>

      <section>
        <h2>URLs Carregadas</h2>
        <ul>
          {loadedUrls.map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
              <button onClick={() => handleDeleteUrl(url)}>Deletar</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Chats Salvos</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>
              {editChatId === chat.id ? (
                <>
                  <input
                    type="text"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                  />
                  <button onClick={() => handleSaveChatName(chat.id)}>
                    Salvar
                  </button>
                </>
              ) : (
                <>
                  <span>{chat.name}</span>
                  <button onClick={() => handleEditChat(chat.id, chat.name)}>
                    Renomear
                  </button>
                </>
              )}
              <button onClick={() => handleDeleteChat(chat.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default UserPage;