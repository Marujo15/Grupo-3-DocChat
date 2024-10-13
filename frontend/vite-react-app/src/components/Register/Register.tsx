import React from "react";
import Header from "../Header/Header";
import "./Register.css";

const Register: React.FC = () => {
    return (
        <>
            <Header variant="register" />
            <div className="register-container">
                <img src="/images/Logo.svg" alt="Logo" />
                <form>
                    <input className="register-login-input" type="text" placeholder="Username" />
                    <input className="register-login-input" type="password" placeholder="Password" />
                    <input className="register-login-input" type="email" placeholder="Email" />
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </>
    );
};

export default Register;