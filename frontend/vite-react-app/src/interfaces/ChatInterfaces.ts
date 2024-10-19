export interface ChatHistoryCardProps {
    date: string;
    title: string;
    chatId: string;
    onEdit: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
}

export interface Chat {
    id: string;
    name: string;
}