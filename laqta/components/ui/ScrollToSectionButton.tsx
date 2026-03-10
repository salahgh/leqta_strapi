"use client";

import { ReactNode } from "react";

interface ScrollToSectionButtonProps {
    targetId: string;
    children: ReactNode;
    className?: string;
}

export const ScrollToSectionButton = ({
    targetId,
    children,
    className = "",
}: ScrollToSectionButtonProps) => {
    const handleClick = () => {
        const target = document.getElementById(targetId);
        if (target) {
            const nav = document.querySelector("nav");
            const navHeight = nav ? nav.getBoundingClientRect().height : 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    return (
        <button onClick={handleClick} className={className}>
            {children}
        </button>
    );
};
