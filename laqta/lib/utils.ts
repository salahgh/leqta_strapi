import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Responsive breakpoint utilities
export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
} as const;

// Typography scale utilities
export const typography = {
    display: {
        xs: "text-display-xs",
        sm: "text-display-sm",
        md: "text-display-md",
        lg: "text-display-lg",
        xl: "text-display-xl",
    },
    body: {
        xs: "text-body-xs",
        sm: "text-body-sm",
        md: "text-body-md",
        lg: "text-body-lg",
        xl: "text-body-xl",
    },
    responsive: {
        xs: "text-responsive-xs",
        sm: "text-responsive-sm",
        md: "text-responsive-md",
        lg: "text-responsive-lg",
    },
} as const;

// Spacing utilities
export const spacing = {
    form: {
        tight: "spacing-form-tight",
        normal: "spacing-form-normal",
    },
    padding: {
        sm: "padding-responsive-sm",
        md: "padding-responsive-md",
    },
} as const;

// Button utilities
export const button = {
    sizes: {
        sm: "btn-size-sm",
        md: "btn-size-md",
        lg: "btn-size-lg",
    },
} as const;
