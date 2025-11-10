import React, { Suspense } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/src/app/[locale]/about/heroSection";
import MissionVisionCards from "@/src/app/[locale]/about/MissionVisionCards";
import Footer from "@/components/sections/Footer";
import { CompetitiveEdge } from "@/src/app/[locale]/about/competitiveEdge";

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
                className="absolute inset-0 z-20"
                style={{
                    background:
                        "linear-gradient(to bottom, #FFFFFF00, #000000)",
                }}
            />
            
            {/* Vector Courbe SVG Layer */}
            <div className="absolute z-30 w-[80%] lg:w-1/2 top-0 left-1/2 transform -translate-x-1/2">
                <img
                    src="/images/vector_courbe.svg"
                    alt="Vector Curve Background"
                    className="h-full aspect-square object-cover"
                />
            </div>
            
            {/* Union SVG Layer */}
            <div className="absolute z-10 w-full" style={{ top: 0, left: 0 }}>
                <img
                    src="/images/union.svg"
                    alt="Union Background"
                    className="object-fill bg w-full"
                />
            </div>
            
            {/* Content Layer */}
            <div className="relative z-40 w-full">
                <Navigation />
                <HeroSection />
                {/* @ts-expect-error Server Component */}
                <MissionVisionCards />
                <CompetitiveEdge />
                <Footer locale={locale} />
            </div>
        </div>
    );
}
