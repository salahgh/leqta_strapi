import React from "react";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { socialMediaApi, SocialMedia } from "@/lib/strapi";

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

    // Fetch social media links from Strapi
    let socialMediaLinks: SocialMedia[] = [];
    try {
        const response = await socialMediaApi.getAll({
            sort: "order:asc",
            locale: locale,
        });
        socialMediaLinks = response.data;
    } catch (error) {
        console.error("Failed to fetch social media links:", error);
        // Fallback to empty array - component will handle gracefully
    }

    return (
        <footer className="bg-primary text-white">
            {/* Main Footer Content */}
            <div className="section-px pt-16 pb-8 md:pt-20 md:pb-12 ">
                {/* Top Section - 3 Column Layout */}
                <div className="flex flex-row  justify-between">
                    {/* Left Column - Logo and Newsletter */}
                    <div className="md:col-span-5 lg:col-span-5 ">
                        {/* Logo with LEQTA text */}
                        <div className="flex items-center gap-4 mb-8 ">
                            <img
                                src="/images/logo.svg"
                                alt="LEQTA Logo"
                                className="h-10 w-auto"
                            />
                            <img
                                src="/images/laqta.svg"
                                alt="LEQTA Logo"
                                className="h-10 w-auto"
                            />
                        </div>

                        {/* Newsletter Section */}
                        <div>
                            <h3 className="font-semibold mb-2 text-body-lg">
                                {t("newsletter")}
                            </h3>
                            <p className="mb-4 text-body-sm text-neutral-400 max-w-sm">
                                {t("newsletterDescription")}
                            </p>

                            <NewsletterForm variant="footer" />
                        </div>
                    </div>

                    <div className={"flex flex-row gap-16"}>
                        {/* Center-Right Column - Company Links */}
                        <div className="space-y-2 ">
                            <h3 className="text-body-md font-semibold mb-4">
                                {t("company")}
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-sm"
                                    >
                                        {t("aboutUs")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/services"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-sm"
                                    >
                                        {t("ourServices")}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#works"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-body-sm"
                                    >
                                        {t("ourWorks")}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#testimonials"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-body-sm"
                                    >
                                        {t("testimonials")}
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-sm"
                                    >
                                        {t("contactUs")}
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#faq"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-body-sm"
                                    >
                                        {t("faq")}
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/blog"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-sm"
                                    >
                                        {t("blog")}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Far Right Column - Utility Pages */}
                        <div className="md:col-span-3 lg:col-span-3 ">
                            <h3 className="text-body-md font-semibold mb-4">
                                {t("utilityPages")}
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/PrivacyPolicy"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-sm"
                                    >
                                        {t("termsCondition")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/PrivacyPolicy"
                                        className="text-neutral-400 hover:text-white transition-colors duration-200 text-body-sm"
                                    >
                                        {t("privacyPolicy")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Large LEQTA Watermark */}
                <div className="relative mt-16 md:mt-24 mb-8 ">
                    <div className="flex justify-center items-end overflow-hidden">
                        <img
                            src="/images/laqta_1.svg"
                            alt=""
                            className="w-full max-w-3xl h-auto opacity-30"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* Bottom Section - Copyright and Social Icons */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/20 ">
                    <p className="text-neutral-400 text-body-sm mb-4 md:mb-0">
                        {t("copyright")}
                    </p>
                </div>
                {/* Social Media Icons */}
                {/*<div className="flex space-x-3">*/}
                {/*    {socialMediaLinks.length > 0 ? (*/}
                {/*        socialMediaLinks.map((social) => (*/}
                {/*            <a*/}
                {/*                key={social.id}*/}
                {/*                href={social.url}*/}
                {/*                target="_blank"*/}
                {/*                rel="noopener noreferrer"*/}
                {/*                className="social-icon-btn touch-target"*/}
                {/*                aria-label={*/}
                {/*                    social.ariaLabel ||*/}
                {/*                    `Visit our ${social.platform} page`*/}
                {/*                }*/}
                {/*            >*/}
                {/*                {social.icon && (*/}
                {/*                    <img*/}
                {/*                        src={social.icon}*/}
                {/*                        alt={social.platform}*/}
                {/*                        className="w-4 h-4"*/}
                {/*                    />*/}
                {/*                )}*/}
                {/*            </a>*/}
                {/*        ))*/}
                {/*    ) : (*/}
                {/*        <>*/}
                {/*            <a*/}
                {/*                href="#"*/}
                {/*                className="social-icon-btn touch-target"*/}
                {/*                aria-label="X (Twitter)"*/}
                {/*            >*/}
                {/*                <img*/}
                {/*                    src="/icons/socialicon.svg"*/}
                {/*                    alt="X"*/}
                {/*                    className="w-4 h-4"*/}
                {/*                />*/}
                {/*            </a>*/}
                {/*            <a*/}
                {/*                href="#"*/}
                {/*                className="social-icon-btn touch-target"*/}
                {/*                aria-label="Facebook"*/}
                {/*            >*/}
                {/*                <img*/}
                {/*                    src="/icons/facebook.svg"*/}
                {/*                    alt="Facebook"*/}
                {/*                    className="w-4 h-4"*/}
                {/*                />*/}
                {/*            </a>*/}
                {/*            <a*/}
                {/*                href="#"*/}
                {/*                className="social-icon-btn touch-target"*/}
                {/*                aria-label="Instagram"*/}
                {/*            >*/}
                {/*                <img*/}
                {/*                    src="/icons/instagram.svg"*/}
                {/*                    alt="Instagram"*/}
                {/*                    className="w-4 h-4"*/}
                {/*                />*/}
                {/*            </a>*/}
                {/*            <a*/}
                {/*                href="#"*/}
                {/*                className="social-icon-btn touch-target"*/}
                {/*                aria-label="LinkedIn"*/}
                {/*            >*/}
                {/*                <img*/}
                {/*                    src="/icons/linkedIn.svg"*/}
                {/*                    alt="LinkedIn"*/}
                {/*                    className="w-4 h-4"*/}
                {/*                />*/}
                {/*            </a>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>
        </footer>
    );
};

export default Footer;
