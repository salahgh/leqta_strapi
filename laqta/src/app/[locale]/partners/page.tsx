import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Partner, partnersApi } from "@/lib/strapi";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { PartnerCard } from "@/components/ui/PartnerCard";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/src/i18n/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "partners" });
    return {
        title: `${t("title")} | Laqta`,
        description: t("description"),
    };
}

async function getPartners(
    locale: string,
): Promise<{ data: Partner[]; error?: string }> {
    try {
        const response = await partnersApi.getAll({
            populate: "*",
            pageSize: 50,
            sort: "order:asc",
            locale,
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching partners:", error);
        return {
            data: [],
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to load partners",
        };
    }
}

const PartnersPage = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "partners" });
    const { data: partners, error: partnersError } = await getPartners(locale);

    return (
        <div className="relative min-h-screen flex flex-col bg-primary">
            {/* Background Vector Curve */}
            <div className="absolute inset-0 z-5 flex justify-center pointer-events-none">
                <img
                    src="/images/vector_courbe.svg"
                    alt=""
                    className="w-2/3 h-2/3 object-fill opacity-70"
                />
            </div>

            <Navigation />

            <main className="relative z-10 flex-1">
                {/* Hero Section */}
                <div className="text-center flex flex-col items-center grid-gap-sm section-py-sm section-px">
                    <div className="animate-slide-down" style={{ opacity: 0 }}>
                        <Badge size="md" variant="accent">
                            {t("badge")}
                        </Badge>
                    </div>

                    <h1
                        className="text-white text-center animate-slide-up"
                        style={{ opacity: 0, animationDelay: "150ms" }}
                    >
                        {t("title")}
                    </h1>

                    <p
                        className="text-secondary-gray text-body-sm sm:text-body-md lg:text-body-lg xl:text-xl max-w-4xl animate-fade-in"
                        style={{ opacity: 0, animationDelay: "300ms" }}
                    >
                        {t("description")}
                    </p>
                </div>

                {/* Partners Grid */}
                <div
                    className="section-px section-py-md animate-fade-in"
                    style={{ opacity: 0, animationDelay: "450ms" }}
                >
                    {partnersError ? (
                        <ErrorFallback
                            title={t("errorTitle")}
                            message={partnersError}
                        />
                    ) : partners.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-white text-body-lg">
                                {t("emptyState")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-container mx-auto">
                            {partners.map((partner) => (
                                <PartnerCard
                                    key={partner.id}
                                    partner={partner}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div
                    className="text-center section-px section-py-md animate-fade-in"
                    style={{ opacity: 0, animationDelay: "600ms" }}
                >
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-white text-display-sm md:text-display-md mb-4">
                            {t("ctaTitle")}
                        </h2>
                        <p className="text-secondary-gray text-body-md md:text-body-lg mb-8">
                            {t("ctaDescription")}
                        </p>
                        <Link href="/partners/become-partner" className="inline-block">
                            <Button
                                leftIcon={<Rocket className="me-2 h-5 w-5" />}
                                rightIcon={null}
                                size="lg"
                            >
                                {t("becomePartner")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    );
};

export default PartnersPage;
