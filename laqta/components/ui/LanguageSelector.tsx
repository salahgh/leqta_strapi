"use client";

/**
 * LanguageSelector Component - Design System
 * Uses design tokens for touch-friendly sizing
 */

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import React from "react";
import { cn } from "@/lib/utils";

// Define locale type
type Locale = "en" | "ar" | "fr";

// Define language structure
interface Language {
    code: Locale;
    name: string;
    flag: React.FC;
    dir: "ltr" | "rtl";
}

interface LanguageSelectorProps {
    className?: string;
}

// Algerian Flag Component
const AlgerianFlag: React.FC = () => (
    <img
        src="/images/algerie%20(1).png"
        alt="Arabic"
        className="aspect-square h-full"
    />
);

// UK Flag Component
const UKFlag: React.FC = () => (
    <img
        src="/images/royaume-uni.png"
        alt="English"
        className="aspect-square h-full"
    />
);

// French Flag Component
const FrenchFlag: React.FC = () => (
    <div className="aspect-square h-full flex rounded-full overflow-hidden">
        <div className="w-1/3 bg-blue-600"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-red-600"></div>
    </div>
);

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "" }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale() as Locale;

    const languages: Language[] = [
        {
            code: "en",
            name: "English",
            flag: UKFlag,
            dir: "ltr",
        },
        {
            code: "ar",
            name: "العربية",
            flag: AlgerianFlag,
            dir: "rtl",
        },
        {
            code: "fr",
            name: "Français",
            flag: FrenchFlag,
            dir: "ltr",
        },
    ];

    const selectedLang = languages.find((lang) => lang.code === locale);

    const handleLanguageSelect = (langCode: Locale): void => {
        if (langCode === locale) {
            setIsOpen(false);
            return;
        }

        startTransition(() => {
            // Use next-intl router for proper locale switching
            router.replace(pathname, { locale: langCode });
            setIsOpen(false);
        });
    };

    return (
        <div className={cn("text-left relative h-full", className)}>
            {/* Selected Language Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={cn(
                    "flex items-center justify-center p-2 gap-2",
                    "border border-white/20 rounded-full",
                    "transition-colors disabled:opacity-50",
                    "touch-target"
                )}
                dir={selectedLang?.dir}
            >
                <div className={"h-full aspect-square"}>
                    {selectedLang && <selectedLang.flag />}
                </div>

                <ChevronDown
                    className={`text-gray-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-max">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageSelect(language.code)}
                            disabled={isPending}
                            className={cn(
                                "h-12 flex items-center gap-2 px-3 py-2 text-left",
                                "hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100",
                                "transition-colors disabled:opacity-50",
                                locale === language.code
                                    ? "bg-primary-light/10 text-primary-light"
                                    : "text-neutral-700"
                            )}
                            dir={language.dir}
                        >
                            <div className="w-5 h-5 rounded-sm overflow-hidden">
                                <language.flag />
                            </div>
                            <span className="font-medium">{language.name}</span>
                            {locale === language.code && (
                                <div className="ml-auto w-2 h-2 bg-primary-light rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
