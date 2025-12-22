// Header Component
import React from "react";
import { Badge } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";

export const Header = async () => {
    const t = await getTranslations("servicesPage");

    return (
        <div className="section-px text-center section-py-md max-w-4xl mx-auto">
            {/* Title */}
            <h1
                className="text-white mb-4 animate-slide-up"
                style={{ opacity: 0, animationDelay: "150ms" }}
            >
                {t("header.title")}
            </h1>

            {/* Description */}
            <p
                className="text-secondary-gray text-body-md md:text-body-lg max-w-2xl mx-auto animate-fade-in"
                style={{ opacity: 0, animationDelay: "300ms" }}
            >
                {t("header.description")}
            </p>
        </div>
    );
};
