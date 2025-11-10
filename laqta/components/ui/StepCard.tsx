import React from "react";

export const StepCard = ({ number, title, description, color, position }) => {
    const colorClasses = {
        teal: 'bg-teal-400',
        yellow: 'bg-yellow-400',
        pink: 'bg-pink-500'
    };

    const numberColorClasses = {
        teal: 'text-teal-400',
        yellow: 'text-yellow-400',
        pink: 'text-pink-500'
    };

    return (
        <div className={`absolute ${position}`}>
            {/* Colored circle */}
            <div className={`w-16 h-16 ${colorClasses[color]} rounded-full mb-6`}></div>

            {/* Large number */}
            <div className={`text-8xl font-bold ${numberColorClasses[color]} mb-4 leading-none`}>
                {number}
            </div>

            {/* Content */}
            <div className="max-w-xs">
                <h3 className="text-white text-body-xl font-semibold mb-3">
                    {title}
                </h3>
                <p className="text-gray-300 text-responsive-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};