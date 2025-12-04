import React from "react";
import { cn } from "@/lib/utils";

/**
 * FormInput Component - Design System
 * Uses design tokens from globals.css and tailwind.config.js
 * Mobile-first with touch-friendly sizes (min 44px height)
 * Uses 16px minimum font-size to prevent iOS zoom on focus
 */

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    as?: "input" | "textarea";
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onBlur?: (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    error?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    rows?: number;
    pill?: boolean;
    /** @deprecated Use size="sm" instead of variant="compact" */
    variant?: "default" | "compact";
    /** @deprecated Use className instead - styles are handled via design tokens */
    style?: React.CSSProperties;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    type = "text",
    placeholder,
    as = "input",
    value,
    onChange,
    onBlur,
    error,
    className,
    size,
    rows = 3,
    pill = true,
    variant,
    style,
}) => {
    // Handle deprecated variant prop - map to size
    const effectiveSize = size || (variant === "compact" ? "sm" : "md");

    const inputSizeClasses = {
        sm: "input-sm",
        md: "input-md",
        lg: "input-lg",
    };

    const baseInputClasses = cn(
        "input-base",
        inputSizeClasses[effectiveSize],
        className,
    );

    const radiusClass = as === "textarea" ? "rounded-lg" : (pill ? "rounded-full" : "rounded-lg");

    return (
        <div className="form-group">
            <label className="form-label">
                {label}
            </label>
            {as === "textarea" ? (
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={rows}
                    className={cn(baseInputClasses, "textarea-base", radiusClass)}
                    style={style}
                />
            ) : (
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={cn(baseInputClasses, radiusClass)}
                    style={style}
                />
            )}
            {error && (
                <p className="form-error">{error}</p>
            )}
        </div>
    );
};
