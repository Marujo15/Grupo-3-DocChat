import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Login.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.token) {
                // Armazena o token no localStorage
                localStorage.setItem("authToken", data.token);
                // Redireciona para a página do usuário
                navigate("/user");
            } else {
                setError("Email ou senha inválidos");
            }
        } catch (error) {
            console.error("Erro ao fazer a requisição:", error);
            setError("Erro ao fazer login. Tente novamente.");
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
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button id="login-btn" type="submit">Entrar</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </>
    );
};

export default Login;