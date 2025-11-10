import React from "react";

interface IconProps {
    className?: string;
}

export const ArrowRightIcon = ({ className = "w-4 h-4" }: IconProps): JSX.Element => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
    </svg>
);

export const ChevronDownIcon = ({ className = "w-4 h-4" }: IconProps): JSX.Element => (
    <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

export const UKFlagIcon = ({ className = "w-[40px] h-[28px]" }: IconProps): JSX.Element => (
    <div className={`relative ${className}`}>
        <svg viewBox="0 0 40 28" className="w-full h-full">
            {/* Blue background */}
            <rect width="40" height="28" fill="#012169" rx="4"/>

            {/* White cross */}
            <path d="M0 14h40M20 0v28" stroke="white" strokeWidth="4.67"/>

            {/* White diagonal cross */}
            <path d="M0 0l40 28M40 0L0 28" stroke="white" strokeWidth="2.33"/>

            {/* Red cross */}
            <path d="M0 14h40M20 0v28" stroke="#C8102E" strokeWidth="2.8"/>

            {/* Red diagonal lines */}
            <path d="M0 0l40 28" stroke="#C8102E" strokeWidth="1.56" strokeDasharray="0 7.8 7.8 7.8"/>
            <path d="M40 0L0 28" stroke="#C8102E" strokeWidth="1.56" strokeDasharray="0 7.8 7.8 7.8"/>
        </svg>
    </div>
);
