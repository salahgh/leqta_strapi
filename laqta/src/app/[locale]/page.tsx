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
import { Navigation } from "@/components/layout/Navigation";
import LetsStartProjectSection from "@/components/sections/LetsStartProjectSection";
import "@/components/sections/styles.css";

// Disable caching for real-time CMS updates
export const dynamic = "force-dynamic";

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
            {/* Hero section - full width background */}
            <HeroSection />

            {/* About section - same background as Testimonials */}
            <div className="w-full relative" style={{ backgroundColor: "#d5ebf9" }}>
                {/* Background Logo */}
                <div className="absolute inset-0 z-0 flex flex-col justify-start items-center -top-16 sm:-top-20 md:-top-24">
                    <img
                        src="/images/laqta_logo_courbe.svg"
                        alt="LAQTA Logo Curve"
                        className="w-2/3 aspect-square object-fill z-0 opacity-70"
                    />
                </div>
                {/* Background gradient layer - extends full width */}
                <div className="absolute inset-0 z-5 blue_gradient" style={{ height: "100%" }} />
                {/* Content constrained to 1512px */}
                <div className="relative z-10 max-w-container mx-auto">
                    <AboutSection illustration={<CustomIllustration />} />
                </div>
            </div>

            {/* Services section - full width with internal max-width */}
            <ServicesSection locale={locale} />

            {/* Works section - gradient background extends full width */}
            <div id="works" className="w-full">
                <OurWorks locale={locale} />
            </div>

            {/* Perfect Partner section */}
            <YourPerfectPartner locale={locale} />

            {/* Testimonials section */}
            <div id="testimonials" className="w-full">
                <TestimonialsSectionWrapper locale={locale} />
            </div>

            {/* Let's Start Project section */}
            <LetsStartProjectSection />

            {/* FAQ section */}
            <div id="faq" className="w-full">
                <FAQSectionWrapper locale={locale} />
            </div>

            {/* Contact section */}
            <ContactUs
                contactEmail={siteSettings?.contactEmail}
                contactPhone={siteSettings?.contactPhone}
                address={siteSettings?.address}
            />

            {/* Footer */}
            <Footer locale={locale} />
        </div>
    );
}
