import React from "react";
import { Header } from "@/src/app/[locale]/pricing/header";
import { PlanCard } from "@/src/app/[locale]/pricing/planCard";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";

export const metadata = {
    title: "Pricing | Laqta",
    description:
        "Explore Laqta's production services - Basic and Premium plans tailored to your content needs.",
};

// Main Component
const PricingPage = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "servicesPage" });

    const basicPlanFeatures = [
        t("basicPlan.features.0"),
        t("basicPlan.features.1"),
        t("basicPlan.features.2"),
    ];

    const basicPlanEquipment = [
        t("basicPlan.equipment.0"),
        t("basicPlan.equipment.1"),
        t("basicPlan.equipment.2"),
        t("basicPlan.equipment.3"),
    ];

    const premiumPlanFeatures = [
        t("premiumPlan.features.0"),
        t("premiumPlan.features.1"),
        t("premiumPlan.features.2"),
        t("premiumPlan.features.3"),
        t("premiumPlan.features.4"),
    ];

    return (
        <div className="relative min-h-screen flex flex-col bg-primary">
            {/* Background gradient */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background:
                        "linear-gradient(135deg, #0D1137 0%, #1a1f4e 50%, #2d1b4e 100%)",
                    willChange: "opacity",
                }}
            />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <Navigation />

            <main className="relative z-10 flex-1">
                {/* Header Section */}
                {/* @ts-expect-error Server Component */}
                <Header />

                {/* Plan Cards Section */}
                <div className="section-px section-py-md">
                    <div className="grid grid-cols-1 lg:grid-cols-2 grid-gap-lg max-w-6xl mx-auto">
                        {/* Basic Plan */}
                        <div
                            className="animate-fade-in"
                            style={{ animationDelay: "300ms", opacity: 0 }}
                        >
                            <PlanCard
                                title={t("basicPlan.title")}
                                description={t("basicPlan.description")}
                                price={t("basicPlan.price")}
                                buttonText={t("basicPlan.buttonText")}
                                features={basicPlanFeatures}
                                equipment={basicPlanEquipment}
                                variant="basic"
                                featuresTitle={t("basicPlan.featuresTitle")}
                                equipmentTitle={t("basicPlan.equipmentTitle")}
                            />
                        </div>

                        {/* Premium Plan */}
                        <div
                            className="animate-fade-in"
                            style={{ animationDelay: "450ms", opacity: 0 }}
                        >
                            <PlanCard
                                title={t("premiumPlan.title")}
                                description={t("premiumPlan.description")}
                                buttonText={t("premiumPlan.buttonText")}
                                features={premiumPlanFeatures}
                                variant="premium"
                                featuresTitle={t("premiumPlan.featuresTitle")}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer locale={locale} />
        </div>
    );
};

export default PricingPage;
