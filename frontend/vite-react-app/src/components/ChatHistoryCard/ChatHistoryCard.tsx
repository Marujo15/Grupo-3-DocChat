import React from "react";
import "./ChatHistoryCard.css";

interface ChatHistoryCardProps {
    date: string;
    title: string;
}

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ date, title }) => {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{date}</p>
        </div>
    );
};

export default ChatHistoryCard;