import React from "react";
import { cn } from "@/lib/utils";

/**
 * Logo Component - Design System
 * Responsive sizing: smaller on mobile, larger on desktop
 */

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    locale?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md", locale }) => {
    const logoSrc = locale === "ar" ? "/images/leqta_logo_arabic.svg" : "/images/laqta.svg";
    const sizeClasses = {
        sm: "h-5 sm:h-6",
        md: "h-6 sm:h-7",
        lg: "h-7 sm:h-8",
    };

    const textSizeClasses = {
        sm: "h-4 sm:h-[18px]",
        md: "h-[18px] sm:h-5",
        lg: "h-5 sm:h-6",
    };

    return (
        <div
            className={cn(
                "flex items-center gap-2 justify-between text-white",
                className
            )}
        >
            <img src="/images/logo.svg" alt="Logo" className={sizeClasses[size]} />
            <img src={logoSrc} alt="Laqta" className={textSizeClasses[size]} />
        </div>
    );
};
