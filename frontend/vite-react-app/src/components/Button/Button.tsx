import React from "react";
import "./Button.css";

interface ButtonProps {
    onClick: (event: React.FormEvent) => void;
    children: React.ReactNode;
    className?: string;
    id?: string;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, id }) => {
    return (
        <button onClick={onClick} className={className} id={id}>
            {children}
        </button>
    );
};

export default Button;