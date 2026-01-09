/**
 * YourPerfectPartner Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";

export const YourPerfectPartner = () => {
    const t = useTranslations("perfectPartner");

    return (
        <div
            className="relative overflow-hidden
            section-px min-h-section-sm md:min-h-section-md xl:min-h-section-lg py-12 sm:py-16 md:py-24 lg:py-32 bg-white h-auto md:h-[700px]"
            style={{
                background:
                    "linear-gradient(to bottom, #0D1137, rgba(99, 114, 239, 0.27), #0D1137)",
            }}
        >
            {/* Desktop background image - constrained to content width */}
            <div className="absolute inset-0 z-0 flex justify-center hidden md:flex">
                <div
                    className="w-full max-w-container"
                    style={{
                        backgroundImage: "url('/images/steps.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right top",
                        backgroundSize: "contain",
                        opacity: 1,
                        height: "86%",
                    }}
                />
            </div>
            <div className="relative z-10 max-w-container mx-auto section-py-md">
                <div
                    className="mb-4 md:mb-8 animate-slide-down"
                    style={{ opacity: 0 }}
                >
                    <Badge size="md" variant="accent">
                        {t("badge")}
                    </Badge>
                </div>

                <h2
                    className="font-medium text-white leading-tight md:max-w-[700px] mt-16 sm:mt-8 animate-slide-up"
                    style={{ opacity: 0, animationDelay: "150ms" }}
                >
                    {t("title")}
                </h2>

                <p
                    className="text-secondary-gray text-body-md sm:text-body-lg lg:text-body-2xl mt-3 md:text-body-lg sm:mt-4 animate-fade-in"
                    style={{ opacity: 0, animationDelay: "300ms" }}
                >
                    {t("description")}
                </p>
            </div>
            {/* Mobile Steps Image */}
            <div
                className="flex w-full justify-center md:hidden animate-fade-in pb-8"
                style={{ opacity: 0, animationDelay: "450ms" }}
            >
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
