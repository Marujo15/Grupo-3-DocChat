import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import "./Login.css";
import { createNewChat, getAllChats } from "../../utils/chatApi";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const data = await response.json();
            setUser({ id: data.user.id, username: data.user.username });
            localStorage.setItem("token", data.token);

            const userChats = await getAllChats();
            if (userChats.length > 0) {
                navigate(`/chat/${userChats[userChats.length - 1].id}`);
            } else {
                const newChat = await createNewChat();
                navigate(`/chat/${newChat.id}`);
            }

        } catch (error) {
            setError("Erro ao fazer login. Tente novamente.");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    return (
        <>
            <Header variant="login" />
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="password-input"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <img className="password-icon" src="/images/Hide.svg" alt="Senha oculta" />
                            ) : (
                                <img className="password-icon" src="/images/Show.svg" alt="Senha aberta" />
                            )}
                        </span>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button id="login-btn" type="submit">Entrar</button>
                </form>
                <img src="/images/Logo.svg" alt="Logo" />
            </div>
        </>
    );
};

export default Login;