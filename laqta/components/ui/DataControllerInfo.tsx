"use client";

/**
 * DataControllerInfo Component
 * Law 18-07 Compliant data controller information display
 *
 * Displays:
 * - Purpose of data collection
 * - Data controller identification
 * - Data rights contact information
 * - Privacy Policy link
 */

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataControllerInfoProps {
    variant?: "full" | "compact";
    dark?: boolean;
    className?: string;
}

export function DataControllerInfo({
    variant = "full",
    dark = false,
    className,
}: DataControllerInfoProps) {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const t = useTranslations("formConsent");
    const tFooter = useTranslations("footer");

    if (variant === "compact") {
        return (
            <div className={cn(
                "text-xs",
                dark ? "text-neutral-400" : "text-gray-500",
                "text-start",
                className
            )}>
                <p>{t("dataController")}</p>
            </div>
        );
    }

    // Full variant (default)
    return (
        <div className={cn(
            "border rounded-lg p-4",
            dark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200",
            "text-start",
            className
        )}>
            <div className={cn(
                "flex items-start gap-3",
                ""
            )}>
                <div className="flex-shrink-0">
                    <Info className={cn("w-5 h-5 mt-0.5", dark ? "text-neutral-400" : "text-gray-400")} />
                </div>
                <div className="flex-1 space-y-2">
                    {/* Purpose text */}
                    <p className={cn("text-sm", dark ? "text-neutral-300" : "text-gray-600")}>
                        {t("purposeText")}
                    </p>

                    {/* Data controller */}
                    <p className={cn("text-sm font-medium", dark ? "text-neutral-200" : "text-gray-700")}>
                        {t("dataController")}
                    </p>

                    {/* Data rights */}
                    <p className={cn("text-sm", dark ? "text-neutral-300" : "text-gray-600")}>
                        {t("dataRights")}
                    </p>

                    {/* Privacy Policy link */}
                    <Link
                        href="/PrivacyPolicy"
                        className={cn(
                            "text-sm underline inline-block",
                            dark ? "text-white hover:text-neutral-200" : "text-primary hover:text-primary-dark"
                        )}
                    >
                        {tFooter("privacyPolicy")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
