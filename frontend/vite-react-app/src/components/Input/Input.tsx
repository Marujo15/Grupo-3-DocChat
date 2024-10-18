import React from "react";
import "./Input.css";
import { InputProps } from "../../interfaces";

const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder,
    className,
    id,
    pattern,
    title,
    required,
    readOnly // Adiciona a propriedade readOnly
}) => {
    return (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            id={id}
            pattern={pattern}
            title={title}
            required={required}
            readOnly={readOnly} // Adiciona a propriedade readOnly
        />
    );
};

export default Input;