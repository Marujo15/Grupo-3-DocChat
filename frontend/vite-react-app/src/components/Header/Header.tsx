import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import { HeaderProps } from "../../interfaces/HeaderInterfaces.ts";
import docChatIcon from "../../assets/svg/Chat_Add.svg";

const Header: React.FC<HeaderProps> = ({ variant = "default" }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isAuthenticated = () => {
        return !!user;
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleNewChat = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/chat/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Request error: ${response.statusText}`);
            }

            const data = await response.json();
            navigate(`/chat/${data.id}`);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    }

    return (
        <header className={`header ${variant}`}>
            <div className="header-buttons">
                {variant === "default" && (
                    <>
                        <div id="main-page-div-btns">
                            <button id="new-chat-btn" onClick={() => handleNewChat()}>
                                <img src={docChatIcon} alt="DocChat Icon" className="docChatIcon" />
                                <span id="new-chat-span">Nova Conversa</span>
                            </button>
                            <div id="login-register-div">
                                {isAuthenticated() ? (
                                    <button className="user-area-button" onClick={() => navigate("/user")}>
                                        Área do usuário
                                    </button>
                                ) : (
                                    <>
                                        <button id="login-btn" onClick={() => navigate("/login")}>Entrar</button>
                                        <button id="register-btn" onClick={() => navigate("/register")}>Cadastrar</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {variant === "login" && (
                    <div>
                        <button className="back-button" onClick={() => navigate("/")}>
                            Voltar
                        </button>
                        <button onClick={() => navigate("/register")}>Cadastrar</button>
                    </div>
                )}
                {variant === "register" && (
                    <div>
                        <button className="back-button" onClick={() => navigate("/")}>
                            Voltar
                        </button>
                        <button onClick={() => navigate("/login")}>Entrar</button>
                    </div>
                )}
                {variant === "user" && (
                    <div className="user-header">
                        <button className="back-button" onClick={() => navigate("/")}>
                            Voltar
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;