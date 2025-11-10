import React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
    primary: cn(
        "bg-gradient-to-r from-[#1370AD] to-[#62C1FF] text-white font-medium",
        "hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none",
        "transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95",
    ),
    secondary: cn(
        "bg-transparent text-gray-400 focus:ring-brand-aqua",
        "transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95",
    ),
};

const buttonSizes = {
    sm: "btn-size-sm text-responsive-sm",
    md: "btn-size-md text-responsive-md",
    lg: "btn-size-lg text-responsive-lg",
};

export const Button = ({
    variant = "primary",
    size = "lg",
    children,
    className = "",
    leftIcon,
    rightIcon,
    darkMode = false,
    style = {},
    ...props
}) => {
    const baseClasses = cn(
        "font-semibold transition-all duration-200 ease-in-out",
        "flex items-center justify-center gap-2 rounded-full border-0 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 shadow h-full w-full",
    );

    const variantClasses =
        darkMode && variant === "secondary"
            ? cn(buttonVariants.secondary, "text-white")
            : buttonVariants[variant];

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses,
                buttonSizes[size],
                className,
            )}
            style={{
                borderColor: variant === "secondary" ? "#54B3F1" : "unset",
                borderWidth: variant === "secondary" ? "1px" : "0px",
                ...style,
            }}
            {...props}
        >
            {leftIcon && (
                <span className="flex-shrink-0 hidden md:inline-flex">
                    {leftIcon}
                </span>
            )}

            <span className="leading-none">{children}</span>

            {rightIcon && (
                <span className="flex-shrink-0 hidden md:inline-flex">
                    {rightIcon}
                </span>
            )}
        </button>
    );
};
