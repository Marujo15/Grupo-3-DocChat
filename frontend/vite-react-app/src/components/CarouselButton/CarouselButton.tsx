import React from "react";
import "./CarouselButton.css";

interface CarouselButtonProps {
    direction: "left" | "right";
    onClick: () => void;
    disabled?: boolean;
}

const CarouselButton: React.FC<CarouselButtonProps> = ({ direction, onClick, disabled }) => {
    return (
        <button
            className={`carousel-button ${direction}`}
            onClick={onClick}
            disabled={disabled}
        >
            {direction === "left" ? "<" : ">"}
        </button>
    );
};

export default CarouselButton;