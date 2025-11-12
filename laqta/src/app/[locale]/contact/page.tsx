import React from "react";
import ContactUs from "@/components/sections/contact/ContactUs";
import Footer from "@/components/sections/Footer";

interface ContactPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { locale } = await params;

    return (
        <>
            <ContactUs />
            <Footer locale={locale} />
        </>
    );
}
