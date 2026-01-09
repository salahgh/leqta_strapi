"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const LetsStartProjectSection = () => {
    const t = useTranslations("letsStartProject");

    return (
        <section className="relative w-full overflow-hidden bg-background py-20 md:py-28 lg:py-36">
            {/* Decorative Orbit Ring - Using Figma SVG asset */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[700px] h-[750px] md:w-[900px] md:h-[970px] lg:w-[1100px] lg:h-[1180px] -rotate-[10deg] -translate-y-[15%]">
                    <Image
                        src="/images/orbit-ring.svg"
                        alt=""
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-[400px]">
                    {/* Blurred text layer (background glow effect) - matches Figma blur-[5.925px] */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center blur-[6px]"
                        aria-hidden="true"
                    >
                        <span className="block font-gotham font-black text-white uppercase text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] xl:text-[140px] 2xl:text-[153px] leading-[0.93]">
                            {t("line1")}
                        </span>
                        <span className="block font-gotham font-black text-white uppercase text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] xl:text-[140px] 2xl:text-[153px] leading-[0.93]">
                            {t("line2")}
                        </span>
                        <span className="block font-gotham font-black text-white uppercase text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] xl:text-[140px] 2xl:text-[153px] leading-[0.93]">
                            {t("line3")}
                        </span>
                    </div>

                    {/* Main text layer */}
                    <h2 className="relative font-gotham font-black text-white leading-[0.93] uppercase">
                        <span className="block text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] xl:text-[140px] 2xl:text-[153px]">
                            {t("line1")}
                        </span>
                        <span className="block text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] xl:text-[140px] 2xl:text-[153px]">
                            {t("line2")}
                        </span>
                        <span className="block text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] xl:text-[140px] 2xl:text-[153px]">
                            {t("line3")}
                        </span>
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default LetsStartProjectSection;
