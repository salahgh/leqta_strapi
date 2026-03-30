import React from "react";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations } from "next-intl/server";
import { BecomePartnerForm } from "./BecomePartnerForm";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "partnerForm" });
    return {
        title: `${t("title")} | Laqta`,
        description: t("description"),
    };
}

export default async function BecomePartnerPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-primary relative">
            {/* Background decorator */}
            <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
                <img
                    src="/images/vector_courbe.svg"
                    alt=""
                    className="w-2/3 h-2/3 object-fill opacity-70"
                />
            </div>

            <Navigation />

            <BecomePartnerForm locale={locale} />

            <Footer locale={locale} />
        </div>
    );
}
