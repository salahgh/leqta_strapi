/**
 * YourPerfectPartner Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";

export const YourPerfectPartner = () => {
    const t = useTranslations('perfectPartner');

    return (
        <div className="relative bg-gradient-to-br from-primary via-primary-light/30 to-primary overflow-hidden section-px min-h-section-sm md:min-h-section-md xl:min-h-section-lg">
            {/* Background Steps Image */}
            <div
                className="absolute inset-0 z-0 hidden md:block md:h-section-sm lg:h-section-md xl:h-section-lg"
                style={{
                    backgroundImage: "url('/images/steps.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center top",
                    backgroundSize: "cover",
                    opacity: 1,
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto section-py-md">
                <div className="mb-4 md:mb-8 animate-slide-down" style={{ opacity: 0 }}>
                    <Badge size="sm" variant="default">{t('badge')}</Badge>
                </div>

                <h1 className="font-medium text-white leading-tight md:max-w-[700px] mt-6 sm:mt-8 animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>
                    {t('title')}
                </h1>

                <p className="text-secondary-gray text-body-sm sm:text-body-md lg:text-body-lg mt-3 sm:mt-4 animate-fade-in" style={{ opacity: 0, animationDelay: "300ms" }}>
                    {t('description')}
                </p>
            </div>

            {/* Mobile Steps Image */}
            <div className="flex w-full justify-center md:hidden animate-fade-in pb-8" style={{ opacity: 0, animationDelay: "450ms" }}>
                <img
                    src="/images/steps_vertical.svg"
                    alt="Steps"
                    className="max-w-full h-auto"
                />
            </div>
        </div>
    );
};

export default YourPerfectPartner;
