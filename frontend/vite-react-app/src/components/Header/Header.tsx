import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { HeaderProps } from "../../interfaces";
import { getInitials } from "../../utils/getInitials";
import docChatIcon from "../../assets/svg/Chat_Add.svg";

const Header: React.FC<HeaderProps> = ({ variant = "default", userName = "" }) => {
    const navigate = useNavigate();

    return (
        <header className={`header ${variant}`}>
            <div className="header-buttons">
                {variant === "default" && (
                    <>
                        <div id="main-page-div-btns">
                            <button id="new-chat-btn" onClick={() => navigate("/new-conversation")}>
                                <img src={docChatIcon} alt="DocChat Icon" className="docChatIcon" />
                                <span id="new-chat-span">Nova Conversa</span>
                            </button>
                            <div id="login-register-div">
                                <button onClick={() => navigate("/login")}>Entrar</button>
                                <button onClick={() => navigate("/register")}>Cadastrar</button>
                            </div>
                        </div>
                    </>
                )}
                {variant === "login" && (
                    <div>
                        <button className="back-button" onClick={() => navigate("/")}>
                        Voltar</button>
                        <button onClick={() => navigate("/register")}>Cadastrar</button>
                    </div>
                )}
                {variant === "register" && (
                    <div>
                        <button className="back-button" onClick={() => navigate("/")}>
                            Voltar</button>
                        <button onClick={() => navigate("/login")}>Entrar</button>
                    </div>
                )}
                {variant === "user" && (
                    <div>
                        <button className="back-button" onClick={() => navigate("/")}>Voltar</button>
                        <button className="user-button">{getInitials(userName)}</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;