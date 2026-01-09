import React from "react";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { siteSettingsApi, SocialMedia, SiteSettings } from "@/lib/strapi";

/**
 * Footer Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 * Layout: Logo+Newsletter (left) | Company Links (center-right) | Utility Pages (far right)
 */

interface FooterProps {
    locale: string;
}

const Footer = async ({ locale }: FooterProps) => {
    const t = await getTranslations("footer");

    // Fetch site settings from Strapi
    let siteSettings: SiteSettings | null = null;
    let socialMediaLinks: SocialMedia[] = [];
    try {
        siteSettings = await siteSettingsApi.get(locale);
        socialMediaLinks = siteSettings?.social_links || [];
    } catch (error) {
        console.error("Failed to fetch site settings:", error);
    }

    return (
        <footer className="relative bg-primary text-white overflow-hidden w-full">
            {/* Background LEQTA Logo */}
            <div className="absolute bottom-0 w-full flex items-center justify-center pointer-events-none">
                <img
                    src="/images/laqta_01.svg"
                    alt=""
                    className="object-cover opacity-30"
                    aria-hidden="true"
                    style={{ marginBottom: -50 }}
                />
            </div>

            {/* Gradient Overlay from bottom (black to transparent) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)",
                }}
            />

            {/* Main Footer Content */}
            <div className="relative z-10 section-px pt-8 sm:pt-10 md:pt-16 lg:pt-20 pb-6 sm:pb-8 md:pb-12 max-w-container mx-auto">
                {/* Top Section - Responsive Layout */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between">
                    {/* Left Column - Logo and Newsletter */}
                    <div className="w-full md:w-auto">
                        {/* Logo with LEQTA text */}
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <img
                                src="/images/logo.svg"
                                alt="LEQTA Logo"
                                className="h-10 md:h-14 w-auto"
                            />
                            <img
                                src="/images/laqta.svg"
                                alt="LEQTA Logo"
                                className="h-8 md:h-10 w-auto"
                            />
                        </div>

                        {/* Newsletter Section */}
                        <div className="max-w-sm">
                            <h3 className="font-semibold mb-2 text-body-md md:text-body-lg">
                                {t("newsletter")}
                            </h3>
                            <p className="mb-4 text-body-xs md:text-body-sm text-neutral-400">
                                {t("newsletterDescription")}
                            </p>
                            <NewsletterForm variant="footer" />
                        </div>
                    </div>

                    {/* Links Columns - Side by side on mobile */}
                    <div className="flex flex-row gap-8 sm:gap-12 md:gap-16">
                        {/* Center-Right Column - Company Links */}
                        <div className="space-y-2">
                            <h3 className="text-body-sm md:text-body-md font-semibold mb-3 md:mb-4">
                                {t("company")}
                            </h3>
                            <ul className="space-y-2 md:space-y-3">
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-xs md:text-body-sm"
                                    >
                                        {t("aboutUs")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/services"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-xs md:text-body-sm"
                                    >
                                        {t("ourServices")}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#works"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-body-xs md:text-body-sm"
                                    >
                                        {t("ourWorks")}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#testimonials"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-body-xs md:text-body-sm"
                                    >
                                        {t("testimonials")}
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-xs md:text-body-sm"
                                    >
                                        {t("contactUs")}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#faq"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-body-xs md:text-body-sm"
                                    >
                                        {t("faq")}
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/blog"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-xs md:text-body-sm"
                                    >
                                        {t("blog")}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Far Right Column - Utility Pages */}
                        <div>
                            <h3 className="text-body-sm md:text-body-md font-semibold mb-3 md:mb-4">
                                {t("utilityPages")}
                            </h3>
                            <ul className="space-y-2 md:space-y-3">
                                <li>
                                    <Link
                                        href="/PrivacyPolicy"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-xs md:text-body-sm"
                                    >
                                        {t("termsCondition")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/PrivacyPolicy"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-xs md:text-body-sm"
                                    >
                                        {t("privacyPolicy")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Large LEQTA Watermark - Hidden on mobile */}
                <div className="hidden md:flex justify-center items-end overflow-hidden">
                    <img
                        src="/images/laqta_1.svg"
                        alt=""
                        className=""
                        aria-hidden="true"
                    />
                </div>
                {/* Bottom Section - Copyright and Social Icons */}
                <div
                    className="flex flex-col md:flex-row justify-between items-center pt-6 mt-8 md:mt-0 border-t border-white/20"
                    style={{ marginTop: undefined }}
                >
                    <p className="text-neutral-400 text-body-sm mb-4 md:mb-0">
                        {siteSettings?.copyrightText || t("copyright")}
                    </p>
                    {/* Social Media Icons - Right aligned */}
                    <div className="flex space-x-3">
                        {socialMediaLinks.length > 0 ? (
                            socialMediaLinks.map((social) => {
                                // Map platform to icon file
                                const iconMap: Record<string, string> = {
                                    facebook: "/icons/facebook.svg",
                                    twitter: "/icons/socialicon.svg",
                                    instagram: "/icons/instagram.svg",
                                    linkedin: "/icons/linkedIn.svg",
                                    youtube: "/icons/youtube.svg",
                                    tiktok: "/icons/tiktok.svg",
                                    github: "/icons/github.svg",
                                    whatsapp: "/icons/whatsapp.svg",
                                    telegram: "/icons/telegram.svg",
                                };
                                const icon = iconMap[social.platform] || "/icons/link.svg";

                                return (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-icon-btn touch-target"
                                        aria-label={social.label || `Visit our ${social.platform} page`}
                                    >
                                        <img
                                            src={icon}
                                            alt={social.platform}
                                            className="w-4 h-4"
                                        />
                                    </a>
                                );
                            })
                        ) : (
                            <>
                                <a
                                    href="#"
                                    className="social-icon-btn touch-target"
                                    aria-label="X (Twitter)"
                                >
                                    <img
                                        src="/icons/socialicon.svg"
                                        alt="X"
                                        className="w-4 h-4"
                                    />
                                </a>
                                <a
                                    href="#"
                                    className="social-icon-btn touch-target"
                                    aria-label="Facebook"
                                >
                                    <img
                                        src="/icons/facebook.svg"
                                        alt="Facebook"
                                        className="w-4 h-4"
                                    />
                                </a>
                                <a
                                    href="#"
                                    className="social-icon-btn touch-target"
                                    aria-label="Instagram"
                                >
                                    <img
                                        src="/icons/instagram.svg"
                                        alt="Instagram"
                                        className="w-4 h-4"
                                    />
                                </a>
                                <a
                                    href="#"
                                    className="social-icon-btn touch-target"
                                    aria-label="LinkedIn"
                                >
                                    <img
                                        src="/icons/linkedIn.svg"
                                        alt="LinkedIn"
                                        className="w-4 h-4"
                                    />
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
