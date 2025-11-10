import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "compact";
    color?: string;
    borderColor?: string;
    className?: string;
    shadow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "default",
    color = "#54B3F1",
    borderColor = "#54B3F1",
    className,
    shadow = false,
    ...props
}) => {
    const baseClasses = "inline-block border rounded-full";

    const variantClasses = {
        default: "padding-responsive-md text-responsive-md",
        compact: "px-6 py-1 text-responsive-md",
    };

    const shadowClass = shadow ? "shadow-lg" : "";

    return (
        <span
            className={cn(
                baseClasses,
                variantClasses[variant],
                shadowClass,
                className,
            )}
            style={{
                color,
                borderColor,
            }}
            {...props}
        >
            {children}
        </span>
    );
};
