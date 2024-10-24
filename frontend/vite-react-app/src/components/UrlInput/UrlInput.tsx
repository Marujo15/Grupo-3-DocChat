import React, { useState } from "react";
import "./UrlInput.css";

const UrlInput: React.FC = () => {
    const [url, setUrl] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/scrape", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button type="submit">Carregar dados</button>
        </form>
    );
};

export default UrlInput;