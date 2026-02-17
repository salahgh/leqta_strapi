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
    dark?: boolean;
    className?: string;
}

export function ConsentCheckbox({
    checked,
    onChange,
    error,
    variant = "full",
    dark = false,
    className,
}: ConsentCheckboxProps) {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const t = useTranslations("formConsent");
    const tFooter = useTranslations("footer");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    if (variant === "compact") {
        return (
            <div className={cn("flex flex-col", className)}>
                <label
                    className="flex items-start gap-3 cursor-pointer group"
                >
                    {/* Checkbox - 44px touch target */}
                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={handleChange}
                            className={cn(
                                "w-5 h-5 rounded border-2 cursor-pointer transition-all",
                                dark
                                    ? "focus:ring-2 focus:ring-white focus:ring-offset-2"
                                    : "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                error
                                    ? dark ? "border-red-400" : "border-red-500 bg-red-50"
                                    : dark ? "border-neutral-400 hover:border-white" : "border-gray-300 hover:border-primary",
                                checked && (dark ? "bg-white border-white" : "bg-primary border-primary")
                            )}
                        />
                    </div>

                    {/* Label text */}
                    <span className={cn(
                        "text-sm pt-2.5",
                        dark ? "text-neutral-300" : "text-gray-700",
                        "text-start"
                    )}>
                        {t("newsletterCheckboxLabel")}{" "}
                        <Link
                            href="/PrivacyPolicy"
                            className={cn(
                                "underline",
                                dark ? "text-white hover:text-neutral-200" : "text-primary hover:text-primary-dark"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {tFooter("privacyPolicy")}
                        </Link>
                    </span>
                </label>

                {/* Error message */}
                {error && (
                    <p className={cn(
                        "text-sm mt-1",
                        dark ? "text-red-400" : "text-red-500",
                        "text-start ms-11"
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
                className="flex items-start gap-3 cursor-pointer group"
            >
                {/* Checkbox - 44px touch target */}
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                        className={cn(
                            "w-5 h-5 rounded border-2 cursor-pointer transition-all",
                            dark
                                ? "focus:ring-2 focus:ring-white focus:ring-offset-2"
                                : "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            error
                                ? dark ? "border-red-400" : "border-red-500 bg-red-50"
                                : dark ? "border-neutral-400 hover:border-white" : "border-gray-300 hover:border-primary",
                            checked && (dark ? "bg-white border-white" : "bg-primary border-primary")
                        )}
                    />
                </div>

                {/* Label text with Privacy Policy link */}
                <span className={cn(
                    "text-sm pt-2.5 leading-relaxed",
                    dark ? "text-neutral-300" : "text-gray-700",
                    "text-start"
                )}>
                    {t("checkboxLabel").split(tFooter("privacyPolicy"))[0]}
                    <Link
                        href="/PrivacyPolicy"
                        className={cn(
                            "underline font-medium",
                            dark ? "text-white hover:text-neutral-200" : "text-primary hover:text-primary-dark"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {tFooter("privacyPolicy")}
                    </Link>
                    {t("checkboxLabel").split(tFooter("privacyPolicy"))[1]}
                </span>
            </label>

            {/* Error message */}
            {error && (
                <p className={cn(
                    "text-sm mt-1",
                    dark ? "text-red-400" : "text-red-500",
                    "text-start ms-11"
                )}>
                    {error}
                </p>
            )}
        </div>
    );
}
