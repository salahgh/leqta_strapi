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
import { Navigation } from "@/components/layout/Navigation";

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

    return (
        <div className="w-full">
            {/*<Navigation />*/}
            <div className="w-full xl:max-w-[1514px] xl:mx-auto">
                <HeroSection />
                <AboutSection illustration={<CustomIllustration />} />
                <ServicesSection locale={locale} />
                <div id="works">
                    <OurWorks locale={locale} />
                </div>
                <YourPerfectPartner locale={locale} />
                <div id="testimonials">
                    <TestimonialsSectionWrapper locale={locale} />
                </div>
                <div id="faq">
                    <FAQSectionWrapper locale={locale} />
                </div>
                <ContactUs />
            </div>
            <Footer locale={locale} />
        </div>
    );
}
