"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
    threshold?: number;
    className?: string;
}

export const BackToTop = ({ threshold = 500, className = "" }: BackToTopProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > threshold);
        };

        // Check on mount
        toggleVisibility();

        // Add scroll listener
        window.addEventListener("scroll", toggleVisibility);

        // Cleanup
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all z-50 ${className}`}
            aria-label="Back to top"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};
