import React from "react";

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
    return (
        <div
            className={`flex items-center gap-2 justify-between text-white ${className}`}
        >
            <img src="/images/logo.svg" alt="Logo" className="h-[26px]" />
            <img src="/images/laqta.svg" alt="Logo" className="h-[18px]" />
        </div>
    );
};
