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
    className?: string;
}

export function DataControllerInfo({
    variant = "full",
    className,
}: DataControllerInfoProps) {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const t = useTranslations("formConsent");
    const tFooter = useTranslations("footer");

    if (variant === "compact") {
        return (
            <div className={cn(
                "text-xs text-gray-500",
                isRTL && "text-right",
                className
            )}>
                <p>{t("dataController")}</p>
            </div>
        );
    }

    // Full variant (default)
    return (
        <div className={cn(
            "bg-gray-50 border border-gray-200 rounded-lg p-4",
            isRTL && "text-right",
            className
        )}>
            <div className={cn(
                "flex items-start gap-3",
                isRTL && "flex-row-reverse"
            )}>
                <div className="flex-shrink-0">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 space-y-2">
                    {/* Purpose text */}
                    <p className="text-sm text-gray-600">
                        {t("purposeText")}
                    </p>

                    {/* Data controller */}
                    <p className="text-sm text-gray-700 font-medium">
                        {t("dataController")}
                    </p>

                    {/* Data rights */}
                    <p className="text-sm text-gray-600">
                        {t("dataRights")}
                    </p>

                    {/* Privacy Policy link */}
                    <Link
                        href="/PrivacyPolicy"
                        className="text-sm text-primary hover:text-primary-dark underline inline-block"
                    >
                        {tFooter("privacyPolicy")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
