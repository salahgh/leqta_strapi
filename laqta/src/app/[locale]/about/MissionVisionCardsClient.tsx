"use client";

import React from "react";
import { Mission } from "@/lib/strapi";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface MissionVisionCardsClientProps {
    missions: Mission[] | undefined;
}

interface CardData {
    key: "vision" | "mission" | "signature";
    iconSrc: string;
}

const cardsData: CardData[] = [
    {
        key: "vision",
        iconSrc: "/images/vision.svg.svg",
    },
    {
        key: "mission",
        iconSrc: "/images/mission.svg.svg",
    },
    {
        key: "signature",
        iconSrc: "/images/signature.svg.svg",
    },
];

export const MissionVisionCardsClient: React.FC<
    MissionVisionCardsClientProps
> = () => {
    const t = useTranslations("missionVision");

    return (
        <section className="py-12 md:py-16 px-2 md:px-12">
            {/* Section Header */}
            <div
                className="text-center space-y-4 mb-12 max-w-3xl mx-auto animate-fade-in"
                style={{ opacity: 0 }}
            >
                <div
                    className="flex justify-center animate-slide-down"
                    style={{ opacity: 0 }}
                >
                    <Badge variant="accent">{t("badge")}</Badge>
                </div>
                <h2
                    className="text-white animate-slide-up"
                    style={{ animationDelay: "150ms", opacity: 0 }}
                >
                    {t("title")}
                </h2>
                <p
                    className="text-secondary-gray text-responsive-lg leading-relaxed animate-fade-in"
                    style={{ animationDelay: "300ms", opacity: 0 }}
                >
                    {t("description")}
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {cardsData.map((card, index) => (
                    <div
                        key={card.key}
                        className="animate-fade-in"
                        style={{
                            animationDelay: `${450 + index * 150}ms`,
                            opacity: 0,
                        }}
                    >
                        <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-default hover:scale-[1.02] transition-all duration-500">
                            {/* Blue Background Layer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 z-0" />

                            {/* LAQTA Logo SVG Layer */}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Image
                                    src="/images/laqta_01.svg"
                                    alt="LAQTA Logo"
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                                />
                            </div>

                            {/* White Gradient Overlay (bottom to top) */}
                            <div
                                className="absolute inset-0 z-20"
                                style={{
                                    background:
                                        "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0) 60%)",
                                }}
                            />

                            {/* Content Layer */}
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 group-hover:translate-y-[-4px] transition-transform duration-500">
                                {/* Icon */}
                                <div className="w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center">
                                    <Image
                                        src={card.iconSrc}
                                        alt={t(`cards.${card.key}.title`)}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="text-gray-900 text-2xl md:text-3xl font-bold mb-3 text-center group-hover:text-blue-700 transition-colors duration-500">
                                    {t(`cards.${card.key}.title`)}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-700 text-center text-responsive-lg leading-relaxed px-4 group-hover:text-gray-800 transition-colors duration-500">
                                    {t(`cards.${card.key}.description`)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
