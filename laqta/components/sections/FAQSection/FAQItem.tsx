import React from "react";

export const FAQItem = ({ question, answer, isOpen, onToggle, isLast }) => {
    return (
        <div className="rounded-2xl mb-4 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-start flex items-center justify-between transition-colors"
            >
                <span className="font-semibold text-black pe-4 text-body-lg sm:text-body-xl md:text-body-2xl">
                    {question}
                </span>
                <div className="flex-shrink-0 rtl:rotate-180">
                    <img
                        src="/icons/arrowUp.svg"
                        alt="Toggle"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
                    <div className="leading-relaxed text-body-md sm:text-body-lg text-gray-500 text-start">
                        {answer}
                    </div>
                </div>
            )}
            {!isLast && (
                <div className="border-b-2 border-gray-100 mx-4 sm:mx-6 md:mx-8"></div>
            )}
        </div>
    );
};
