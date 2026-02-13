"use client";

/**
 * FloatingCTAButton Component
 * A floating call-to-action button that scrolls to a target section.
 * Hides when the target section is in view.
 */

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FloatingCTAButtonProps {
    targetId: string;
    label: string;
    threshold?: number;
}

export const FloatingCTAButton = ({
    targetId,
    label,
    threshold = 300,
}: FloatingCTAButtonProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Hide when near the target section
            const target = document.getElementById(targetId);
            if (target) {
                const rect = target.getBoundingClientRect();
                const isNearTarget = rect.top < window.innerHeight && rect.bottom > 0;
                setIsVisible(window.pageYOffset > threshold && !isNearTarget);
            } else {
                setIsVisible(window.pageYOffset > threshold);
            }
        };

        toggleVisibility();
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [threshold, targetId]);

    const scrollToTarget = () => {
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTarget}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-accent-blue to-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all z-50 flex items-center gap-2 font-medium"
            aria-label={label}
        >
            {label}
            <ChevronDown className="w-5 h-5" />
        </button>
    );
};
