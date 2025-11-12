// Header Component
import React from "react";

export const Header = () => (
    <div className="px-4 md:px-8 text-center py-4 md:py-6 space-y-3 md:space-y-4 animate-fade-in">
        <h1 className="font-semibold text-white animate-slide-down">Basic Production</h1>
        <p className="leading-relaxed text-secondary-gray text-responsive-lg max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "200ms" }}>
            Leqta offers flexible production options to match your content needs
            and brand ambitions. Choose between our efficient Basic Plan or a
            fully tailored Premium Plan designed around your objectives.
        </p>
    </div>
);
