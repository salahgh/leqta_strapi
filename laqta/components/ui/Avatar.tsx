import React from "react";

interface AvatarProps {
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '' }) => {
    return (
        <img src="/images/logo.svg" alt="Logo" className="w-8 h-8"/>
    );
};
