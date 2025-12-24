import React from "react";
import { cn } from "@/lib/utils";

/**
 * Button Component - Design System
 * Uses design tokens from globals.css and tailwind.config.js
 * Mobile-first with touch-friendly sizes (min 44px height)
 */

const buttonVariants = {
    primary: cn(
        "bg-gradient-primary-button text-white font-medium",
        "hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none",
        "focus:ring-2 focus:ring-primary-light focus:ring-offset-2",
        "transition-all duration-200 ease-in-out hover:scale-105 active:scale-95",
    ),
    secondary: cn(
        "bg-transparent text-form-text border border-accent-blue",
        "hover:bg-accent-blue/10 focus:ring-accent-blue",
        "transition-all duration-200 ease-in-out hover:scale-105 active:scale-95",
    ),
    ghost: cn(
        "bg-transparent text-white hover:bg-white/10",
        "focus:ring-2 focus:ring-white/20",
        "transition-all duration-200 ease-in-out",
    ),
};

const buttonSizes = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
    xl: "btn-xl",
};

export const Button = ({
    variant = "primary",
    size = "md",
    children,
    className = "",
    leftIcon,
    rightIcon,
    darkMode = false,
    fullWidth = false,
    pill = true,
    ...props
}) => {
    const variantClasses =
        darkMode && variant === "secondary"
            ? cn(buttonVariants.secondary, "text-white")
            : buttonVariants[variant];

    const radiusClass = pill ? "rounded-full" : "rounded-lg";
    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={cn(
                buttonSizes[size],
                variantClasses,
                radiusClass,
                widthClass,
                className,
            )}
            {...props}
        >
            {leftIcon && (
                <span className="flex-shrink-0 hidden sm:inline-flex rtl:rotate-180">
                    {leftIcon}
                </span>
            )}

            <span className="leading-none whitespace-nowrap">{children}</span>

            {rightIcon && (
                <span className="flex-shrink-0 hidden sm:inline-flex rtl:rotate-180">
                    {rightIcon}
                </span>
            )}
        </button>
    );
};
