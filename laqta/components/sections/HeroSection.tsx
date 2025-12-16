/**
 * HeroSection Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import { Button } from "@/components/ui/Button";
import { Rocket } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Navigation } from "@/components/layout/Navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import React from "react";

export const HeroSection: React.FC = () => {
    const t = useTranslations("hero");
    const locale = useLocale();
    const heroImage = locale === "ar"
        ? "/images/where_creativity_arabic.svg"
        : "/images/wherecreativitymeetsstrategy.svg";

    return (
        <div className="relative bg-primary flex flex-col items-center justify-center w-full text-center p-4 sm:p-8 md:p-12 md:pb-24 lg:pb-36 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-hero-fade" />

            {/* Vector Courbe SVG Layer */}
            <div className="absolute z-30 w-4/5 lg:w-1/2">
                <img
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    className="h-full aspect-square object-cover"
                />
            </div>

            {/* Union SVG Layer */}
            <div className="absolute z-10 w-full top-0 left-0">
                <img
                    src="/images/union.svg"
                    alt="Union Background"
                    className="object-fill bg"
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-40 w-full">
                <Navigation />
                <div
                    className="pt-4 flex justify-center animate-fade-in"
                    style={{ opacity: 0 }}
                >
                    <Logo className="md:hidden" />
                </div>
                <img
                    src={heroImage}
                    alt={t("title")}
                    className="w-full pt-2 px-2 lg:px-44 animate-slide-up"
                    style={{ opacity: 0, animationDelay: "150ms" }}
                />
                <p
                    className="text-body-md sm:text-body-lg lg:text-body-xl font-medium text-secondary-gray
                    section-px max-w-4xl mx-auto leading-relaxed
                    text-justify sm:text-center md:text-justify lg:text-center animate-fade-in"
                    style={{
                        opacity: 0,
                        animationDelay: "300ms",
                        lineHeight: "1.8",
                    }}
                >
                    {t("description")}
                </p>

                {/* Spacer */}
                <div className="h-6 sm:h-8 md:h-12 lg:h-14" />

                {/* CTA Buttons */}
                <div
                    className="flex w-full flex-col items-center justify-center gap-3 sm:gap-4 md:flex-row animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                >
                    <Link href="/services" className="w-full sm:w-auto">
                        <Button
                            size="xl"
                            fullWidth
                            className="sm:w-48"
                            leftIcon={null}
                            rightIcon={<Rocket className="ml-2 h-4 w-4" />}
                        >
                            {t("getStarted")}
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button
                            variant="secondary"
                            size="xl"
                            fullWidth
                            className="sm:w-48"
                            leftIcon={null}
                            rightIcon={null}
                        >
                            {t("contactUs")}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
