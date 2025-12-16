// Competitive Edge Component
import React from "react";
import { Badge } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface Advantage {
    iconSrc: string;
    titleKey: "creativity" | "resilience" | "attention" | "commitment";
}

const advantages: Advantage[] = [
    {
        iconSrc: "/images/creativity.svg",
        titleKey: "creativity",
    },
    {
        iconSrc: "/images/resilience.svg",
        titleKey: "resilience",
    },
    {
        iconSrc: "/images/attention.svg",
        titleKey: "attention",
    },
    {
        iconSrc: "/images/commitement.svg",
        titleKey: "commitment",
    },
];

export const CompetitiveEdge = async () => {
    const t = await getTranslations("competitiveEdge");

    return (
        <section
            className="rounded-3xl relative border border-gray-700/30 p-16
            shadow-2xl hover:border-gray-600/40 transition-all duration-500 "
            style={{ backgroundColor: "#a3d4f6" }}
        >
            <div className="absolute inset-0 z-1 flex px-12 items-center justify-center">
                <img
                    src="/images/laqta_logo_courbe.svg"
                    alt="LAQTA Logo Curve"
                    className="object-contain opacity-90 "
                />
            </div>

            <div className="absolute inset-0 z-5 blue_gradient" />
            <div className="text-center relative space-y-4 md:space-y-6  md:py-8 flex flex-col items-center animate-fade-in">
                <div className="animate-slide-down" style={{ opacity: 0 }}>
                    <Badge size="md" variant="accent">
                        {t("badge")}
                    </Badge>
                </div>

                <h2
                    className="leading-tight text-gray-800 animate-slide-up "
                    style={{ animationDelay: "150ms" }}
                >
                    {t("title")}
                </h2>
                <p
                    className="text-responsive-lg text-secondary-gray max-w-3xl leading-relaxed animate-fade-in"
                    style={{ animationDelay: "300ms", opacity: 0 }}
                >
                    {t("description")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 p-6">
                {advantages.map((advantage, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden bg-primary rounded-2xl p-6 md:p-8 border border-blue-400/20 flex items-center
                        hover:border-blue-400/40 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20
                        transition-all duration-500 cursor-default animate-fade-in"
                        style={{
                            animationDelay: `${450 + index * 150}ms`,
                            opacity: 0,
                        }}
                    >
                        {/* Leqta Courbe SVG Background */}
                        <div
                            className="absolute inset-0 flex items-center justify-center
                        group-hover:opacity-30 transition-opacity duration-500"
                        >
                            <img
                                src="/images/leqta_courbe.svg"
                                alt=""
                                className="object-fill scale-75 mb-32"
                            />
                        </div>

                        {/* Blue Gradient Light from Bottom */}
                        <div
                            className="absolute inset-0 z-10"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)",
                            }}
                        />

                        {/* Content */}
                        <div className="flex flex-col items-center w-full">
                            <img
                                src={advantage.iconSrc}
                                alt={t(`advantages.${advantage.titleKey}`)}
                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                            />

                            <h3 className="text-white font-semibold text-lg md:text-xl group-hover:translate-x-2 transition-transform duration-500">
                                {t(`advantages.${advantage.titleKey}`)}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
