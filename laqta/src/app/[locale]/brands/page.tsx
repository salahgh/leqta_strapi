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
                <div className="mb-8 mt-32">
                    <span
                        className="inline-block border px-6 py-4 rounded-full"
                        style={{
                            color: "#54B3F1",
                            borderColor: "#54B3F1",
                            fontSize: 20,
                        }}
                    >
                        Our Partners
                    </span>
                </div>
                <p style={{ fontSize: 56 }} className={"text-white"}>
                    Brands That Trust LEQTA
                </p>
                <p
                    style={{ color: "#C6BBBB", fontSize: 24, maxWidth: 900 }}
                    className="mt-4 mb-8 text-center"
                >
                    We're proud to collaborate with leading brands, bold
                    startups, and visionary changemakers. Together we create
                    content that leaves an impact.
                </p>
                <img
                    src="/images/brands.png"
                    alt="Logo"
                    // className="w-full h-full"
                />
                <div className={"mt-8 mb-16 flex justify-center h-16"}>
                    <Button leftIcon={undefined} rightIcon={undefined}>
                        Become a partner
                    </Button>
                </div>
            </div>
            <Footer locale={locale} />
        </div>
    );
}
