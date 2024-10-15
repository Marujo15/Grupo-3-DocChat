import React, { useRef, useState, useEffect } from "react";
import "./Carousel.css";
import ChatHistoryCard from "../ChatHistoryCard/ChatHistoryCard";
import CarouselButton from "../CarouselButton/CarouselButton";

const Carousel: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [showButtons, setShowButtons] = useState(false);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                const totalCardWidth = cards.length * 210;
                setShowButtons(totalCardWidth > carouselWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Exemplo de dados de cards
    const cards = [
        { date: "2023-10-01", title: "Conversa 1" },
        { date: "2023-10-02", title: "Conversa 2" },
        { date: "2023-10-02", title: "Conversa 3" },
        { date: "2023-10-02", title: "Conversa 4" },
        { date: "2023-10-02", title: "Conversa 5" },
        { date: "2023-10-02", title: "Conversa 6" },
        { date: "2023-10-02", title: "Conversa 7" },
    ];

    return (
        <div className="carousel-container">
            {showButtons && <CarouselButton direction="left" onClick={scrollLeft} />}
            <div className="carousel" ref={carouselRef}>
                {cards.map((card, index) => (
                    <ChatHistoryCard key={index} date={card.date} title={card.title} />
                ))}
            </div>
            {showButtons && <CarouselButton direction="right" onClick={scrollRight} />}
        </div>
    );
};

export default Carousel;