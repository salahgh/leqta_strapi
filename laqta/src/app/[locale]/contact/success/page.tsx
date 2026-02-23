import React from "react";
import ContactSuccess from "@/components/sections/contact/ContactSuccess";
import Footer from "@/components/sections/Footer";

interface SuccessPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function ContactSuccessPage({
    params,
}: SuccessPageProps) {
    const { locale } = await params;

    return (
        <>
            <ContactSuccess />
            <Footer locale={locale} />
        </>
    );
}
