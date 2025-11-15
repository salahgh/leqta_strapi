import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/src/app/[locale]/about/heroSection";
import MissionVisionCards from "@/src/app/[locale]/about/MissionVisionCards";
import Footer from "@/components/sections/Footer";
import { CompetitiveEdge } from "@/src/app/[locale]/about/competitiveEdge";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

// Metadata generation
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "aboutHero" });

    return {
        title: "About Us | Leqta",
        description: t("description") || "Learn more about Leqta, a creative agency specializing in content marketing and production services.",
        openGraph: {
            title: "About Us | Leqta",
            description: t("description"),
            type: "website",
        },
    };
}

// Main About Page Component - Make it async to handle async components
export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <div className="relative bg-primary flex flex-col w-full min-h-screen overflow-hidden">
            {/* Gradient Overlay Layer */}
            <div
                className="absolute inset-0 z-20 opacity-90"
                style={{
                    background:
                        "linear-gradient(to bottom, #FFFFFF00, #000000)",
                }}
            />

            {/* Vector Courbe SVG Layer */}
            <div className="absolute z-30 w-[80%] lg:w-1/2 top-0 left-1/2 transform -translate-x-1/2 opacity-40">
                <Image
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    width={800}
                    height={800}
                    className="h-full aspect-square object-cover"
                    priority
                />
            </div>

            {/* Union SVG Layer */}
            <div className="absolute z-10 w-full" style={{ top: 0, left: 0 }}>
                <Image
                    src="/images/union.svg"
                    alt="Union Background"
                    width={1920}
                    height={1080}
                    className="object-fill bg w-full"
                    priority
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-40 w-full">
                <Navigation />
                <div className="space-y-8 md:space-y-12 lg:space-y-16">
                    <HeroSection />
                    {/* @ts-expect-error Server Component */}
                    <MissionVisionCards />
                    <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                        <CompetitiveEdge />
                    </div>
                </div>
                <div className="mt-12 md:mt-16">
                    <Footer locale={locale} />
                </div>
            </div>
        </div>
    );
}
