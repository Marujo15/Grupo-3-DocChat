import React from "react";
import Button from "../Button/Button";
import "./CarouselButton.css";

interface CarouselButtonProps {
    direction: "left" | "right";
    onClick: () => void;
}

const CarouselButton: React.FC<CarouselButtonProps> = ({ direction, onClick }) => {
    return (
        <Button onClick={onClick} className={`carousel-button ${direction}`}>
            {direction === "left" ? "<" : ">"}
        </Button>
    );
};

export default CarouselButton;