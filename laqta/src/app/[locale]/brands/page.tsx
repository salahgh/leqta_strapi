import { Navigation } from "@/components/layout/Navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/sections/Footer";

export default async function BrandsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <div>
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col justify-center items-center">
                <Navigation />
                <div className="mb-8 mt-32 animate-slide-down" style={{ opacity: 0 }}>
                    <span className="badge-lg badge-outline text-accent-blue border-accent-blue">
                        Our Partners
                    </span>
                </div>
                <h1 className="text-display-lg md:text-display-xl lg:text-display-2xl text-white animate-slide-up" style={{ opacity: 0, animationDelay: "150ms" }}>
                    Brands That Trust LEQTA
                </h1>
                <p
                    className="mt-4 mb-8 text-center animate-fade-in text-secondary-gray text-body-lg md:text-body-xl max-w-4xl section-px"
                    style={{ opacity: 0, animationDelay: "300ms" }}
                >
                    We're proud to collaborate with leading brands, bold
                    startups, and visionary changemakers. Together we create
                    content that leaves an impact.
                </p>
                <img
                    src="/images/brands.png"
                    alt="Logo"
                    className="animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                />
                <div className="mt-8 mb-16 flex justify-center h-16 animate-fade-in" style={{ opacity: 0, animationDelay: "600ms" }}>
                    <Button leftIcon={undefined} rightIcon={undefined} size="lg">
                        Become a partner
                    </Button>
                </div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}
