import React from "react";
import { cn } from "@/lib/utils";

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
    style?: React.CSSProperties;
    variant?: "default" | "compact";
    rows?: number;
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
    style = {},
    variant = "default",
    rows = 3,
}) => {
    const containerSpacing =
        variant === "compact" ? "spacing-form-tight" : "spacing-form-normal";
    const inputPadding =
        variant === "compact"
            ? "padding-responsive-sm"
            : "padding-responsive-md";

    const baseInputClasses = cn(
        "form-input-base text-responsive-lg",
        inputPadding,
        className,
    );

    return (
        <div className={containerSpacing}>
            <label
                className={cn(
                    "form-label-base text-responsive-lg mb-0.5 md:mb-1",
                )}
            >
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
                    className={cn(baseInputClasses, "rounded-lg")}
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
                    className={cn(baseInputClasses, "rounded-full ")}
                    style={{ color: "#D2D2D3", ...style }}
                />
            )}
            {error && (
                <div className="text-red-400 mt-0.5 md:mt-1">{error}</div>
            )}
        </div>
    );
};
