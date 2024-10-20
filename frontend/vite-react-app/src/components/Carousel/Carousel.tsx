import React, { useEffect, useState, useRef } from "react";
import ChatHistoryCard from "../ChatHistoryCard/ChatHistoryCard";
import CarouselButton from "../CarouselButton/CarouselButton";
import { ChatCard } from "../../interfaces/ChatInterfaces";
import { CarouselProps } from "../../interfaces/CarouselInterfaces";
import "./Carousel.css";

const Carousel: React.FC<CarouselProps> = ({ userId }) => {
    const [showButtons, setShowButtons] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [cards, setCards] = useState<ChatCard[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Token not found. Redirecting to Login Page.");
                    return;
                }
                const response = await fetch(`http://localhost:3000/api/chat/${userId}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Request Error: ${response.statusText}`);
                }
    
                const data = await response.json();
                setCards(data);
    
            } catch (error) {
                console.error("Error when making the request:", error);
            }
        };

        fetchChats();
    }, [userId]);

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

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };


    return (
        <div className="carousel-container">
            {showButtons && <CarouselButton direction="left" onClick={scrollLeft} disabled={isAtStart} />}
            <div className="carousel" ref={carouselRef}>
                {cards.map(card => (
                    <ChatHistoryCard
                        key={card.id}
                        chatId={card.id}
                        date={formatDate(card.created_at)}
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