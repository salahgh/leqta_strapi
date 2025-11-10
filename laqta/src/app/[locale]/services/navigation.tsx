"use client";

// Navigation Component
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export const Navigation = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const dropdownRef = useRef(null);

    const navItems = [
        { name: "Basic Production", active: true },
        { name: "Advertising Content Production", active: false },
        { name: "Content Marketing Strategy", active: false },
        { name: "Integrated Content Marketing", active: false },
    ];

    // Update active states based on activeItem index
    const updatedNavItems = navItems.map((item, index) => ({
        ...item,
        active: index === activeItem,
    }));

    const activeItemName = updatedNavItems[activeItem].name;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // if (
            //     dropdownRef.current &&
            //     !dropdownRef.current?.contains(event.target)
            // ) {
            //     setIsDropdownOpen(false);
            // }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle item selection
    const handleItemSelect = (index) => {
        setActiveItem(index);
        setIsDropdownOpen(false);
    };

    return (
        <nav className="flex justify-center gap-4 w-full bg-pink-200 px-2 h-12">
            {/* Back Button */}
            <div className={"aspect-square h-full"}>
                <button
                    className="rounded-full h-full  border border-gray-600 hover:bg-gray-700 transition-colors
                flex items-center justify-center aspect-square bg-blue-200"
                >
                    <ArrowLeft className="w-8 h-8 text-white" />
                </button>
            </div>
            {/*/!* Desktop Navigation *!/*/}
            {/*<div className="hidden md:flex gap-6 rounded-full border border-gray-500 px-8 h-full items-center">*/}
            {/*    {updatedNavItems.map((item, index) => (*/}
            {/*        <button*/}
            {/*            key={index}*/}
            {/*            onClick={() => handleItemSelect(index)}*/}
            {/*            className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${*/}
            {/*                item.active*/}
            {/*                    ? "text-white bg-white/10 shadow-lg"*/}
            {/*                    : "text-gray-400 hover:text-white hover:bg-white/5"*/}
            {/*            }`}*/}
            {/*            style={{ fontSize: 20 }}*/}
            {/*        >*/}
            {/*            {item.name}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div
                className="md:hidden relative flex-1 max-w-md mt-1"
                ref={dropdownRef}
            >
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-full rounded-full border border-gray-500 px-4 flex items-center justify-between bg-gray-900/50
                    backdrop-blur-sm hover:bg-gray-800/50 transition-colors"
                    style={{ height: 45 }}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                >
                    <span className="text-white font-medium text-lg truncate">
                        {activeItemName}
                    </span>
                    <ChevronDown
                        className={`w-6 h-6 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                            isDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                        <div className="py-1">
                            {updatedNavItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleItemSelect(index)}
                                    className={`w-full px-6 py-2 text-left transition-all duration-200 flex items-center justify-between hover:bg-gray-700/50 ${
                                        item.active
                                            ? "bg-blue-600/20 text-white border-l-4 border-blue-500"
                                            : "text-gray-300 hover:text-white"
                                    }`}
                                    role="option"
                                    aria-selected={item.active}
                                >
                                    <span className="font-medium text-base leading-tight">
                                        {item.name}
                                    </span>
                                    {item.active && (
                                        <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
