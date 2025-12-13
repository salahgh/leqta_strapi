import React from "react";

export const FAQItem = ({ question, answer, isOpen, onToggle, isLast }) => {
    return (
        <div className="rounded-2xl mb-4 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full md:px-8 md:py-6 px-6 py-4 text-left flex items-center justify-between transition-colors"
            >
                <span className="font-semibold text-black pr-4 text-body-2xl">
                    {question}
                </span>
                <div className="flex-shrink-0">
                    <img
                        src="/icons/arrowUp.svg"
                        alt="Logo"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="px-8 pb-6">
                    <div className=" leading-relaxed text-responsive-lg text-gray-500 text-left">
                        {answer}
                    </div>
                </div>
            )}
            {!isLast && (
                <div className={"border-2 border-gray-100 px-32"}></div>
            )}
        </div>
    );
};
