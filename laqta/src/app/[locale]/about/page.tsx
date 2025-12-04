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
            {/* Background Layers Container - Optimized for performance */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Union SVG Layer */}
                <div className="absolute w-full inset-0" style={{ willChange: 'opacity' }}>
                    <Image
                        src="/images/union.svg"
                        alt="Union Background"
                        width={1920}
                        height={1080}
                        className="object-fill w-full h-full"
                        priority
                    />
                </div>

                {/* Gradient Overlay Layer */}
                <div
                    className="absolute inset-0 opacity-90"
                    style={{
                        background: "linear-gradient(to bottom, #FFFFFF00, #000000)",
                        willChange: 'opacity'
                    }}
                />

                {/* Vector Courbe SVG Layer */}
                <div className="absolute w-[80%] lg:w-1/2 top-0 left-1/2 transform -translate-x-1/2 opacity-40" style={{ willChange: 'opacity, transform' }}>
                    <Image
                        src="/images/vector_courbe.svg"
                        alt="Vector Curve Background"
                        width={800}
                        height={800}
                        className="h-full aspect-square object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Navigation */}
            <Navigation />

            {/* Content Layer */}
            <div className="relative z-0 w-full flex-1">
                <div className="stack-gap-lg">
                    <HeroSection />
                    {/* @ts-expect-error Server Component */}
                    <MissionVisionCards />
                    <div className="section-px max-w-7xl mx-auto">
                        <CompetitiveEdge />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-0 mt-auto">
                <Footer locale={locale} />
            </div>
        </div>
    );
}
