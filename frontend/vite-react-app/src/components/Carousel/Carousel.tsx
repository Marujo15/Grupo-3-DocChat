import React, { useEffect, useRef, useState } from "react";
import ChatHistoryCard from "../ChatHistoryCard/ChatHistoryCard";
import CarouselButton from "../CarouselButton/CarouselButton";
import "./Carousel.css";

const Carousel: React.FC = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [cards, setCards] = useState([
        { id: "1", date: "2023-10-01", title: "Conversa 1" },
        { id: "2", date: "2023-10-02", title: "Conversa 2" },
        { id: "3", date: "2023-10-02", title: "Conversa 3" },
        { id: "4", date: "2023-10-02", title: "Conversa 4" },
        { id: "5", date: "2023-10-02", title: "Conversa 5" },
        { id: "6", date: "2023-10-02", title: "Conversa 6" },
        { id: "7", date: "2023-10-02", title: "Conversa 7" },
    ]);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                const totalCardWidth = cards.length * 210;
                setShowButtons(totalCardWidth > carouselWidth);
                setIsAtStart(carouselRef.current.scrollLeft === 0);
                setIsAtEnd(carouselRef.current.scrollLeft + carouselWidth >= totalCardWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [cards]);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -210, behavior: "smooth" });
            setTimeout(() => {
                if (carouselRef.current) {
                    setIsAtStart(carouselRef.current.scrollLeft === 0);
                    setIsAtEnd(carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >= carouselRef.current.scrollWidth);
                }
            }, 300);
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 210, behavior: "smooth" });
            setTimeout(() => {
                if (carouselRef.current) {
                    setIsAtStart(carouselRef.current.scrollLeft === 0);
                    setIsAtEnd(carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >= carouselRef.current.scrollWidth);
                }
            }, 300);
        }
    };

    const handleDelete = (id: string) => {
        setCards(cards.filter(card => card.id !== id));
    };

    const handleEdit = (id: string, newName: string) => {
        setCards(cards.map(card => card.id === id ? { ...card, title: newName } : card));
    };

    return (
        <div className="carousel-container">
            {showButtons && <CarouselButton direction="left" onClick={scrollLeft} disabled={isAtStart} />}
            <div className="carousel" ref={carouselRef}>
                {cards.map((card) => (
                    <ChatHistoryCard
                        key={card.id}
                        chatId={card.id}
                        date={card.date}
                        title={card.title}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            {showButtons && <CarouselButton direction="right" onClick={scrollRight} disabled={isAtEnd} />}
        </div>
    );
};

export default Carousel;