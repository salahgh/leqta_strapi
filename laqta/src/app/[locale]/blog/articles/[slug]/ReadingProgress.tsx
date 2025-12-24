"use client";

import React, { useState, useEffect } from "react";

export const ReadingProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(Math.min(100, Math.max(0, scrollPercent)));
            setScrolled(scrollTop > 20);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed left-0 w-full h-1 bg-neutral-200/30 z-[60] transition-all duration-300
                ${scrolled ? 'top-12 sm:top-14 md:top-16 opacity-100' : 'top-14 sm:top-16 md:top-24 opacity-0'}
            `}
        >
            <div
                className="h-full bg-gradient-primary transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};