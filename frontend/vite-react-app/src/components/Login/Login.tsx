import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import "./Login.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUsername } = useAuth();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.auth) {
                setUsername(data.username);
                localStorage.setItem("username", data.username);
                navigate("/user");
            } else {
                setError("Email ou senha inválidos");
                setTimeout(() => {
                    setError("");
                }, 3000);
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
                                <img src="/images/Hide.svg" alt="Senha oculta" />
                            ) : (
                                <img src="/images/Show.svg" alt="Senha aberta" />
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