import React, { useEffect, useState, useRef } from "react";
import ChatHistoryCard from "../ChatHistoryCard/ChatHistoryCard";
import CarouselButton from "../CarouselButton/CarouselButton";
import { ChatCard } from "../../interfaces/ChatInterfaces";
import { CarouselProps } from "../../interfaces/CarouselInterfaces";
import { useChat } from "../../context/ChatContext";
import { getAllChats } from "../../utils/chatApi";
import { formatDate } from "../../utils/formatDate";
import "./Carousel.css";
import { useAuth } from "../../context/AuthContext";

const Carousel: React.FC<CarouselProps> = () => {
    const [showButtons, setShowButtons] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [cards, setCards] = useState<ChatCard[]>([]);
    const [carouselClass, setCarouselClass] = useState("center");
    const [showSlideButtons, setShowSlideButtons] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const chat = useChat();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                if (user) {
                    const data = await getAllChats();
                    setCards(data);
                }
            } catch (error) {
                console.error("Error when making the request:", error);
            }
        };
        fetchChats();
    }, [user, chat.chats]);

    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current && cardRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                const cardWidth = cardRef.current.offsetWidth;
                const totalCardWidth = cards.length * cardWidth;

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

    useEffect(() => {
        if (cardRef.current && carouselRef.current && cards.length * cardRef.current.offsetWidth >= carouselRef.current.offsetWidth) {
            setCarouselClass("flex-start");
            setShowSlideButtons(true);
        } else {
            setCarouselClass("center");
            setShowSlideButtons(false);
        }
    }, [cards]);

    const scrollLeft = () => {
        if (carouselRef.current && cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
            setTimeout(() => {
                if (carouselRef.current) {
                    setIsAtStart(carouselRef.current.scrollLeft === 0);
                    setIsAtEnd(carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >= carouselRef.current.scrollWidth);
                }
            }, 300);
        }
    };

    const scrollRight = () => {
        if (carouselRef.current && cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
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
            {showButtons && showSlideButtons && <CarouselButton direction="left" onClick={scrollLeft} disabled={isAtStart} />}
            <div className={`carousel ${carouselClass}`} ref={carouselRef}>
                {cards.map(card => (
                    <div key={card.id} ref={cardRef}>
                        <ChatHistoryCard
                            chatId={card.id}
                            date={formatDate(card.created_at)}
                            title={card.title}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                ))}
            </div>
            {showButtons && showSlideButtons && <CarouselButton direction="right" onClick={scrollRight} disabled={isAtEnd} />}
        </div>
    );
};

export default Carousel;