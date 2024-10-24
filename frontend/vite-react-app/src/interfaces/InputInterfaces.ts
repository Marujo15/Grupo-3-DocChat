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