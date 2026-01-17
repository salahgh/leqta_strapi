import React, { Suspense } from "react";
import ContactUs from "@/components/sections/contact/ContactUs";
import Footer from "@/components/sections/Footer";

interface ContactPageProps {
    params: Promise<{
        locale: string;
    }>;
    searchParams: Promise<{
        service?: string;
        serviceName?: string;
        plan?: string;
        planName?: string;
        work?: string;
        workName?: string;
    }>;
}

export default async function ContactPage({
    params,
    searchParams,
}: ContactPageProps) {
    const { locale } = await params;
    const urlParams = await searchParams;

    return (
        <>
            <Suspense fallback={<div className="min-h-screen bg-primary" />}>
                <ContactUs
                    preSelectedService={urlParams.serviceName}
                    preSelectedServiceSlug={urlParams.service}
                    preSelectedPlan={urlParams.planName}
                    preSelectedPlanId={urlParams.plan}
                    preSelectedWork={urlParams.workName}
                    preSelectedWorkSlug={urlParams.work}
                />
            </Suspense>
            <Footer locale={locale} />
        </>
    );
}
