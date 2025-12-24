import React from "react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface CardProps {
    icon?: LucideIcon;
    iconSrc?: string;
    title: string;
    description: string;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    icon: IconComponent,
    iconSrc,
    title,
    description,
    className = "",
}) => {
    return (
        <div
            className={`group aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 m-2 sm:m-3 md:m-4 flex flex-col items-center justify-center text-center overflow-hidden
            hover:shadow-3xl hover:from-white hover:to-gray-50 transition-all duration-500 ease-out cursor-default
            border border-gray-200/50 hover:border-blue-300/50 ${className}`}
        >
            {/* Animated gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 z-0"></div>

            {/* Background Logo - Smaller and positioned higher */}
            <div
                className="absolute z-0 flex flex-col justify-start items-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
            >
                <Image
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    width={200}
                    height={200}
                    className="w-1/2 aspect-square object-fill z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-4 group-hover:translate-y-[-4px] transition-transform duration-500">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white/30
                    group-hover:scale-110 group-hover:shadow-xl group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-500">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center
                        group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-500">
                            {iconSrc ? (
                                <Image
                                    src={iconSrc}
                                    alt={title}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 filter brightness-0 invert group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : IconComponent ? (
                                <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" />
                            ) : null}
                        </div>
                    </div>
                </div>
                {/* Title - Bigger and Bolder */}
                <h2 className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight group-hover:text-blue-700 transition-colors duration-500">{title}</h2>
                {/* Description */}
                <p className="leading-relaxed text-responsive-lg text-gray-700 text-center px-2 group-hover:text-gray-800 transition-colors duration-500">{description}</p>
            </div>
        </div>
    );
};