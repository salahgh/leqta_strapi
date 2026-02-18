import React from "react";
import { Rocket } from "lucide-react";

interface ComingSoonProps {
    title: string;
    message: string;
    variant?: "light" | "dark";
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
    title,
    message,
    variant = "light",
}) => {
    const isLight = variant === "light";

    return (
        <div className="flex justify-center animate-fade-in" style={{ opacity: 0 }}>
            <div
                className={`flex flex-col items-center text-center card-p-md lg:card-p-lg rounded-card max-w-lg w-full ${
                    isLight
                        ? "bg-white shadow-card"
                        : "bg-white/10 border border-white/20"
                }`}
            >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-blue/15 rounded-full flex items-center justify-center mb-4 sm:mb-5">
                    <Rocket
                        className="w-7 h-7 sm:w-8 sm:h-8 text-accent-blue"
                        strokeWidth={1.5}
                    />
                </div>

                <h3
                    className={`text-body-lg sm:text-body-xl font-semibold mb-2 ${
                        isLight ? "text-primary" : "text-white"
                    }`}
                >
                    {title}
                </h3>

                <p
                    className={`text-body-sm sm:text-body-md max-w-sm ${
                        isLight ? "text-secondary-gray" : "text-neutral-300"
                    }`}
                >
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;
