import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Register.css";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            navigate("/login");
        } catch (error) {
            console.error("Erro ao cadastrar o usuário:", error);
            setError("Erro ao cadastrar o usuário. Por favor, tente novamente.");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    return (
        <>
            <Header variant="register" />
            <div className="register-container">
                <img src="/images/Logo.svg" alt="Logo" />
                <form onSubmit={handleRegister}>
                    <input
                        className="register-login-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="password-container">
                        <input
                            className="register-login-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <input
                        className="register-login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </>
    );
};

export default Register;