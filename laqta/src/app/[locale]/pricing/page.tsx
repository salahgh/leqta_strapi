import React from "react";
import { Header } from "@/src/app/[locale]/pricing/header";
import { DynamicPlanCard } from "@/src/app/[locale]/pricing/planCard";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";
import { plansApi, Plan } from "@/lib/strapi";
import { ErrorFallback } from "@/components/ui/ErrorFallback";

export const metadata = {
    title: "Pricing | Laqta",
    description:
        "Explore Laqta's production services - Basic and Premium plans tailored to your content needs.",
};

// Fetch plans from Strapi
async function getPlans(locale: string): Promise<{ data: Plan[]; error?: string }> {
    try {
        const response = await plansApi.getAll({
            sort: "order:asc",
            locale: locale,
        });
        return { data: response.data || [] };
    } catch (error) {
        console.error("Error fetching plans:", error);
        return {
            data: [],
            error: error instanceof Error ? error.message : "Failed to load plans",
        };
    }
}

// Main Component
const PricingPage = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "servicesPage" });

    // Fetch plans from Strapi
    const { data: plans, error: plansError } = await getPlans(locale);

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
                    {plansError ? (
                        <ErrorFallback
                            title="Unable to load plans"
                            message={plansError}
                        />
                    ) : plans.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-white text-body-lg">
                                No plans available at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-gap-lg max-w-container mx-auto">
                            {plans.map((plan, index) => (
                                <div
                                    key={plan.id || index}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${300 + index * 150}ms`, opacity: 0 }}
                                >
                                    <DynamicPlanCard plan={plan} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer locale={locale} />
        </div>
    );
};

export default PricingPage;
