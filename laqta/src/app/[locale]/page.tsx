import AboutSection from "@/components/sections/aboutLaqta";
import { CustomIllustration } from "@/components/ui/CustomIllustration";
import ServicesSection from "@/components/sections/ServicesSection";
import OurWorks from "@/components/sections/OurWorksSection";
import YourPerfectPartner from "@/components/sections/YourPerfectPartner";
import ContactUs from "@/components/sections/ContactUs";
import React from "react";
import { TestimonialsSectionWrapper } from "@/components/sections/successStories/TestimonialSectionWrapper";
import FAQSectionWrapper from "@/components/sections/FAQSection/FAQSectionWrapper";
import { HeroSection } from "@/components/sections/HeroSection";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/sections/Footer";
import { siteSettingsApi } from "@/lib/strapi";

// Disable caching for real-time CMS updates
export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "hero" });

    return {
        title: t("title") + " | Leqta",
        description: t("description"),
    };
}

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    console.log("Home page - locale:", locale);

    // Fetch site settings for contact info
    const siteSettings = await siteSettingsApi.get(locale);

    return (
        <div className="w-full">
            {/*<Navigation />*/}
            <div className="w-full xl:max-w-container xl:mx-auto">
                <HeroSection />
                <div
                    className={"bg-white rounded-2xl sm:rounded-3xl"}
                    style={{ backgroundColor: "#d5ebf9" }}
                >
                    <AboutSection illustration={<CustomIllustration />} />
                </div>
                <ServicesSection locale={locale} />
                <div
                    id="works"
                    className={"rounded-2xl"}
                    style={{ backgroundColor: "#d5ebf9" }}
                >
                    <OurWorks locale={locale} />
                </div>
                <YourPerfectPartner locale={locale} />
                <div id="testimonials">
                    <TestimonialsSectionWrapper locale={locale} />
                </div>
                <div id="faq">
                    <FAQSectionWrapper locale={locale} />
                </div>
                <ContactUs
                    contactEmail={siteSettings?.contactEmail}
                    contactPhone={siteSettings?.contactPhone}
                    address={siteSettings?.address}
                />
                <Footer locale={locale} />
            </div>
        </div>
    );
}
