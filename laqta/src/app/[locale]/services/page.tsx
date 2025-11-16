import React from "react";
import { Header } from "@/src/app/[locale]/services/header";
import { PlanCard } from "@/src/app/[locale]/services/planCard";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";

export const metadata = {
    title: "Services | Laqta",
};

// Main Component
const BasicProductionPage = async ({
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
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen flex flex-col">
            {/* Fixed gradient background to prevent flickering */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pointer-events-none z-0" style={{ willChange: 'opacity' }} />

            <Navigation />
            <div className="relative z-0 flex-1">
                <div className="space-y-4 md:space-y-8 pb-8 pt-8">
                    <Header />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                    {/* Basic Plan */}
                    <div className="animate-fade-in" style={{ animationDelay: "300ms", opacity: 0 }}>
                        <PlanCard
                            frameId="Frame 170480111"
                            title={t("basicPlan.title")}
                            description={t("basicPlan.description")}
                            price={t("basicPlan.price")}
                            buttonText={t("basicPlan.buttonText")}
                            buttonColor="bg-blue-500 hover:bg-blue-600 text-white"
                            features={basicPlanFeatures}
                            equipment={basicPlanEquipment}
                            gradient="bg-gradient-to-br from-gray-800 to-gray-900"
                        />
                    </div>

                    {/* Premium Plan */}
                    <div className="animate-fade-in" style={{ animationDelay: "500ms", opacity: 0 }}>
                        <PlanCard
                            title={t("premiumPlan.title")}
                            description={t("premiumPlan.description")}
                            buttonText={t("premiumPlan.buttonText")}
                            buttonColor="bg-teal-500 hover:bg-teal-600 text-white"
                            features={premiumPlanFeatures}
                            gradient="bg-gradient-to-br from-purple-800 via-pink-700 to-purple-900"
                            price={undefined}
                            equipment={undefined}
                            frameId={undefined}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-0 mt-auto">
                <Footer locale={locale} />
            </div>
        </div>
    );
};

export default BasicProductionPage;
