import React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge Component - Design System
 * Uses design tokens from globals.css and tailwind.config.js
 * Mobile-first with slightly larger sizes on mobile for tap targets
 */

interface BadgeProps {
    children: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg";
    variant?: "default" | "accent" | "solid" | "outline";
    className?: string;
    shadow?: boolean;
    icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    size = "md",
    variant = "default",
    className,
    shadow = false,
    icon,
    ...props
}) => {
    const sizeClasses = {
        xs: "badge-xs",
        sm: "badge-sm",
        md: "badge-md",
        lg: "badge-lg",
    };

    const variantClasses = {
        default: "badge-default",
        accent: "badge-accent",
        solid: "badge-solid",
        outline: "badge-outline",
    };

    const shadowClass = shadow ? "shadow-lg" : "";
    const iconClass = icon ? "badge-icon" : "";

    return (
        <span
            className={cn(
                "badge-base",
                sizeClasses[size],
                variantClasses[variant],
                shadowClass,
                iconClass,
                className,
            )}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </span>
    );
};
