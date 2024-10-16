import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
    variant?: "default" | "login" | "register";
}

const Header: React.FC<HeaderProps> = ({ variant = "default" }) => {
    const navigate = useNavigate();

    return (
        <header className={`header ${variant}`}>
            <div className="header-buttons">
                {variant === "default" && (
                    <>
                        <div id="main-page-div-btns">
                            <button onClick={() => navigate("/login")}>Entrar</button>
                            <button onClick={() => navigate("/register")}>Cadastrar</button>
                        </div>
                    </>
                )}
                {variant === "login" && (
                    <div>
                        <button className="back-button" onClick={() => navigate(-1)}>
                        Voltar</button>
                        <button onClick={() => navigate("/register")}>Cadastrar</button>
                    </div>
                )}
                {variant === "register" && (
                    <div>
                        <button className="back-button" onClick={() => navigate(-1)}>
                            Voltar</button>
                        <button onClick={() => navigate("/login")}>Entrar</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;