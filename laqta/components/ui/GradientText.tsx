import React from "react";

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({children, className = ''}) => {
    return (
        <span
            className={`bg-gradient-to-r from-brand-aqua via-brand-yellow to-brand-pink bg-clip-text text-transparent font-bold ${className}`}>
        {children}
      </span>
    );
};
