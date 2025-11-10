"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/src/i18n/navigation"; // Use next-intl navigation
import { useLocale } from "next-intl";
import React from "react";

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
    <div className="aspect-square h-full flex">
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
        <div className={`text-left relative h-full ${className}`}>
            {/* Selected Language Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center justify-center p-2 gap-2 border border-gray-50
                rounded-full transition-colors disabled:opacity-50"
                dir={selectedLang?.dir}
                style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
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
                            className={`h-12 flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors disabled:opacity-50 ${
                                locale === language.code
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700"
                            }`}
                            dir={language.dir}
                        >
                            <language.flag className="w-5 h-5 rounded-sm" />
                            <span className="font-medium">{language.name}</span>
                            {locale === language.code && (
                                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
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
