export interface Message {
    sender: "user" | "ai";
    text: string;
}

export interface ChatHistoryCardProps {
    date: string;
    title: string;
}

export interface HeaderProps {
    variant?: "default" | "login" | "register" | "user";
    userName?: string;
}

export interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    id?: string;
    pattern?: string;
    title?: string;
    required?: boolean;
    readOnly?: boolean;
}

export interface Message {
    sender: "user" | "ai";
    text: string;
}

export interface AuthContextType {
    username: string;
    setUsername: (username: string) => void;
}

export interface Chat {
    id: string;
    name: string;
}