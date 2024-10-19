import React from "react";
import "./Input.css";
import { InputProps } from "../../interfaces/InputInterfaces.ts";

const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder,
    className,
    id,
    pattern,
    title,
    required,
    readOnly
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
            readOnly={readOnly}
        />
    );
};

export default Input;