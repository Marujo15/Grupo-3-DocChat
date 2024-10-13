import React from "react";
import Header from "../Header/Header";
import "./Login.css";

const Login: React.FC = () => {
    return (
        <>
            <Header variant="login" />
            <div className="login-container">
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Entrar</button>
                </form>
                <img src="/images/Logo.svg" alt="" />
            </div>
        </>
    );
};

export default Login;