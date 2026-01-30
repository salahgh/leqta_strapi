"use client";

/**
 * ConsentCheckbox Component
 * Law 18-07 Compliant consent checkbox with Privacy Policy link
 *
 * Requirements:
 * - NOT pre-checked (explicit consent required)
 * - Privacy Policy link
 * - Touch-friendly (44px min target)
 * - RTL support for Arabic
 */

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/lib/utils";

interface ConsentCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    variant?: "full" | "compact";
    className?: string;
}

export function ConsentCheckbox({
    checked,
    onChange,
    error,
    variant = "full",
    className,
}: ConsentCheckboxProps) {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const t = useTranslations("formConsent");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    if (variant === "compact") {
        return (
            <div className={cn("flex flex-col", className)}>
                <label
                    className={cn(
                        "flex items-start gap-3 cursor-pointer group",
                        isRTL && "flex-row-reverse"
                    )}
                >
                    {/* Checkbox - 44px touch target */}
                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={handleChange}
                            className={cn(
                                "w-5 h-5 rounded border-2 cursor-pointer transition-all",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                error
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 hover:border-primary",
                                checked && "bg-primary border-primary"
                            )}
                        />
                    </div>

                    {/* Label text */}
                    <span className={cn(
                        "text-sm text-gray-700 pt-2.5",
                        isRTL && "text-right"
                    )}>
                        {t("newsletterCheckboxLabel")}{" "}
                        <Link
                            href="/PrivacyPolicy"
                            className="text-primary hover:text-primary-dark underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {t("newsletterCheckboxLabel")}
                        </Link>
                    </span>
                </label>

                {/* Error message */}
                {error && (
                    <p className={cn(
                        "text-sm text-red-500 mt-1",
                        isRTL ? "text-right mr-11" : "ml-11"
                    )}>
                        {error}
                    </p>
                )}
            </div>
        );
    }

    // Full variant (default)
    return (
        <div className={cn("flex flex-col", className)}>
            <label
                className={cn(
                    "flex items-start gap-3 cursor-pointer group",
                    isRTL && "flex-row-reverse"
                )}
            >
                {/* Checkbox - 44px touch target */}
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                        className={cn(
                            "w-5 h-5 rounded border-2 cursor-pointer transition-all",
                            "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            error
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 hover:border-primary",
                            checked && "bg-primary border-primary"
                        )}
                    />
                </div>

                {/* Label text with Privacy Policy link */}
                <span className={cn(
                    "text-sm text-gray-700 pt-2.5 leading-relaxed",
                    isRTL && "text-right"
                )}>
                    {t("checkboxLabel").split("Privacy Policy")[0]}
                    <Link
                        href="/PrivacyPolicy"
                        className="text-primary hover:text-primary-dark underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Privacy Policy
                    </Link>
                    {t("checkboxLabel").split("Privacy Policy")[1]}
                </span>
            </label>

            {/* Error message */}
            {error && (
                <p className={cn(
                    "text-sm text-red-500 mt-1",
                    isRTL ? "text-right mr-11" : "ml-11"
                )}>
                    {error}
                </p>
            )}
        </div>
    );
}
